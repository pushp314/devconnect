import { db } from '@/lib/db';

const URL = 'https://code.appnity.co.in';

function generateUrl(path: string, lastModified: Date, priority: number) {
    return `
        <url>
            <loc>${URL}${path}</loc>
            <lastmod>${lastModified.toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>${priority}</priority>
        </url>
    `;
}

export async function GET() {
    const snippets = await db.snippet.findMany({
        where: { visibility: 'public' },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, updatedAt: true },
    });

    const docs = await db.document.findMany({
        orderBy: { updatedAt: 'desc' },
        select: { slug: true, updatedAt: true },
    });

    const users = await db.user.findMany({
        orderBy: { updatedAt: 'desc' },
        select: { username: true, updatedAt: true },
    });
    
    const components = await db.component.findMany({
        where: { status: 'approved' },
        orderBy: { updatedAt: 'desc' },
        select: { id: true, updatedAt: true },
    });

    const now = new Date();

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${generateUrl('', now, 1.0)}
    ${generateUrl('/explore', now, 0.8)}
    ${generateUrl('/docs', now, 0.8)}
    ${generateUrl('/community', now, 0.8)}
    ${generateUrl('/marketplace', now, 0.8)}
    ${generateUrl('/playground', now, 0.7)}
    ${generateUrl('/convert', now, 0.7)}
    ${generateUrl('/bugs', now, 0.7)}
    ${snippets.map(s => generateUrl(`/snippets/${s.id}`, s.updatedAt, 0.9)).join('')}
    ${docs.map(d => generateUrl(`/docs/${d.slug}`, d.updatedAt, 0.9)).join('')}
    ${users.map(u => generateUrl(`/${u.username}`, u.updatedAt, 0.8)).join('')}
    ${components.map(c => generateUrl(`/marketplace/${c.id}`, c.updatedAt, 0.9)).join('')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
