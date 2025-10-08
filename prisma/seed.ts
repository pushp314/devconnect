
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- ADMIN USERS ---
  const adminUsers = [
    {
      email: 'pusprajsharma314@gmail.com',
      name: 'Pushp Raj Sharma',
      username: 'pushprajsharma',
      image: 'https://lh3.googleusercontent.com/a/ACg8ocKAaiDrkrfvu3C6GFOJ_36ICnQRa8xaU9PeyNs_B5MWDL0aKNq1=s96-c',
      bio: 'Administrator and lead developer of CodeStudio.',
    }
  ];

  let createdAdminUsers = [];

  for (const admin of adminUsers) {
      const adminUser = await prisma.user.upsert({
        where: { email: admin.email },
        update: { role: Role.ADMIN },
        create: {
          ...admin,
          role: Role.ADMIN,
        },
      });
      createdAdminUsers.push(adminUser);
      console.log('Found/Created admin user:', { adminUser });
  }

  const primaryAdmin = createdAdminUsers[0];


  // --- SNIPPETS ---
  const snippets = [
    {
      title: 'Interactive Counter Button',
      description: 'A simple React component demonstrating state management with a counter button. Click the button to increment the number.',
      language: 'React',
      code: `() => {
    const [count, setCount] = React.useState(0);
    return (
        <div class="flex flex-col items-center gap-4 text-center p-4">
            <h3 class="font-headline text-xl">React Counter</h3>
            <p className="text-muted-foreground text-sm">Click the button below to see the count increase.</p>
            <Button onClick={() => setCount(count + 1)} className="w-48">
                <MousePointerClick className="mr-2" />
                Clicked {count} times
            </Button>
        </div>
    )
}`,
      tags: ['react', 'state', 'hooks', 'button', 'interactive'],
    }
  ];

  for (const snippet of snippets) {
    await prisma.snippet.upsert({
      where: { title: snippet.title },
      update: {},
      create: {
        ...snippet,
        authorId: primaryAdmin.id,
      },
    });
  }

  console.log('Created snippet.');
  
  // --- DOCUMENTS ---
  const docs = [
    {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-with-nextjs',
      content: `
# Getting Started with Next.js

Next.js is a powerful React framework for building server-side rendered and static web applications.

## Installation

To create a new Next.js app, run the following command:
\`\`\`bash
npx create-next-app@latest
\`\`\`

## Key Features

- **File-based Routing**: Create pages by adding files to the \`src/app\` directory.
- **Server Components**: Render components on the server to reduce client-side JavaScript.
- **API Routes**: Easily create API endpoints within your Next.js application.
      `,
      tags: ['nextjs', 'react', 'tutorial', 'webdev'],
    }
  ];

  for (const doc of docs) {
    await prisma.document.upsert({
      where: { slug: doc.slug },
      update: {},
      create: {
        ...doc,
        authorId: primaryAdmin.id,
      },
    });
  }

  console.log('Created document.');

  // --- MARKETPLACE COMPONENTS ---
  const components = [
    {
      title: "Animated Login Form",
      description: "A beautifully animated login form component built with Framer Motion and Tailwind CSS. Includes input fields for email and password, a submit button, and social login options. Fully responsive and easy to customize.",
      price: 15,
      tags: ["react", "form", "animation", "auth", "tailwind"],
      previewUrls: ["https://picsum.photos/seed/loginform/600/400"],
      zipFileUrl: "/placeholder.zip",
      status: "approved",
      creatorId: primaryAdmin.id,
    }
  ];

  for (const component of components) {
    await prisma.component.upsert({
        where: { title: component.title },
        update: {},
        create: component
    });
  }

  console.log("Created marketplace component.");

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
