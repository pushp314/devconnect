import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import multer from 'multer';
import { auth } from '@/lib/auth';

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Helper to run multer middleware
const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = new NextResponse();

  try {
    // Need to cast req to 'any' for multer compatibility with Next.js 14 App Router
    const anyReq = req as any;
    const anyRes = res as any;

    // Use multer to handle both single and multiple file fields
    const uploadMiddleware = upload.fields([
        { name: 'previewImages' },
        { name: 'componentZip', maxCount: 1 }
    ]);
    
    await runMiddleware(anyReq, anyRes, uploadMiddleware);
    
    // After middleware, files are available in `anyReq.files`
    const files = anyReq.files;
    
    if (!files || !files.previewImages || !files.componentZip) {
      return NextResponse.json({ error: 'Missing required files.' }, { status: 400 });
    }

    const previewImages = files.previewImages as Express.Multer.File[];
    const componentZip = files.componentZip[0] as Express.Multer.File;

    const previewUrls = previewImages.map(file => `/uploads/${file.filename}`);
    const zipFileUrl = `/uploads/${componentZip.filename}`;

    return NextResponse.json({ 
        message: 'Files uploaded successfully',
        previewUrls,
        zipFileUrl 
    });

  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: error.message || 'File upload failed.' }, { status: 500 });
  }
}
