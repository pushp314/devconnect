
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- ADMIN USER ---
  const adminUser = await prisma.user.upsert({
    where: { email: 'pusprajsharma314@gmail.com' },
    update: { role: Role.ADMIN },
    create: {
      email: 'pusprajsharma314@gmail.com',
      name: 'Pushp Raj Sharma',
      username: 'pushprajsharma',
      image: 'https://lh3.googleusercontent.com/a/ACg8ocKAaiDrkrfvu3C6GFOJ_36ICnQRa8xaU9PeyNs_B5MWDL0aKNq1=s96-c',
      bio: 'Administrator and lead developer of CodeStudio.',
      role: Role.ADMIN,
    },
  });
  console.log('Found/Created admin user:', { adminUser });

  // --- SNIPPETS ---
  const snippets = [
    {
      title: 'Interactive React Counter Button',
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
      usage: `### How to Use\n\nThis is a self-contained React component. You can drop it into any React project that uses a similar UI component library (like shadcn/ui). The component manages its own state using the \`useState\` hook.\n\n\`\`\`jsx\n// No external props are needed.\n<InteractiveCounterButton />\n\`\`\`\n\nMake sure you have React and a Button component available in your scope.`,
      tags: ['react', 'state', 'hooks', 'button', 'interactive'],
    },
    {
      title: 'Python Debounce Decorator',
      description: 'A Python decorator that debounces a function, ensuring it only runs after a certain period of inactivity.',
      language: 'Python',
      code: `import time
import threading

def debounce(wait):
    """Decorator that prevents a function from being called too frequently."""
    def decorator(fn):
        def debounced(*args, **kwargs):
            def call_it():
                fn(*args, **kwargs)
            try:
                debounced.t.cancel()
            except(AttributeError):
                pass
            debounced.t = threading.Timer(wait, call_it)
            debounced.t.start()
        return debounced
    return decorator

@debounce(0.5)
def handle_input(query):
    print(f"Searching for: {query}")

# Example usage:
handle_input("rea")
handle_input("react")
time.sleep(0.6)
handle_input("react hooks")`,
      usage: `### Usage\n\nThis decorator can be applied to any Python function to prevent it from being executed too frequently. It's useful for handling user input, API calls, or other rate-limited tasks.\n\n1.  **Apply the decorator** to your function with the desired wait time in seconds.\n2.  Call the function as you normally would. It will only execute after the specified \`wait\` time has passed without any new calls.\n\n\`\`\`python\n@debounce(0.5) # 500ms debounce time\ndef my_function(arg1, arg2):\n    # Function logic here\n    print(f"Executing with {arg1} and {arg2}")\n\`\`\``,
      tags: ['python', 'decorator', 'debounce', 'utility', 'performance'],
    },
    {
      title: 'JavaScript Slugify Function',
      description: 'A simple JavaScript function to convert any string into a URL-friendly slug.',
      language: 'JavaScript',
      code: `function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-');
}`,
      usage: `### How to Use\n\nThis function takes a single string argument and returns a URL-friendly slug. It handles whitespace, special characters, and accents.\n\n\`\`\`javascript\nconst title = "My Awesome Blog Post! (New & Improved)";\nconst slug = slugify(title);\nconsole.log(slug); // "my-awesome-blog-post-new-improved"\n\`\`\``,
      tags: ['javascript', 'function', 'slug', 'utility', 'string'],
    },
     {
      title: 'Simple HTML Accordion',
      description: 'A pure HTML and CSS implementation of a responsive accordion component using details and summary tags.',
      language: 'HTML',
      code: `<div class="w-full max-w-md mx-auto">
  <details class="group border-b py-2" open>
    <summary class="flex items-center justify-between cursor-pointer list-none">
      <span class="font-medium">Question 1: What is this?</span>
      <span class="transition group-open:rotate-180">
        <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
      </span>
    </summary>
    <p class="mt-2 text-neutral-600">This is a simple accordion component built with only HTML and a little bit of CSS for styling the open/close rotation.</p>
  </details>
  <details class="group border-b py-2">
    <summary class="flex items-center justify-between cursor-pointer list-none">
      <span class="font-medium">Question 2: Is it accessible?</span>
       <span class="transition group-open:rotate-180">
        <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
      </span>
    </summary>
    <p class="mt-2 text-neutral-600">Yes, using the \`<details>\` and \`<summary>\` elements provides great accessibility out of the box.</p>
  </details>
</div>`,
      usage: `### Usage\n\nThis component requires no JavaScript. You can directly paste this HTML into your project. Tailwind CSS is used for styling in this example, but you can replace the classes with your own custom styles. The core functionality is handled entirely by the browser's native implementation of the \`<details>\` and \`<summary>\` elements.`,
      tags: ['html', 'css', 'accordion', 'component', 'no-js'],
    },
     {
      title: 'Go API Middleware for Logging',
      description: 'A middleware for a Go web server that logs incoming requests, including the method, path, and time taken.',
      language: 'Go',
      code: `package main

import (
	"log"
	"net/http"
	"time"
)

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		log.Printf("Started %s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
		log.Printf("Completed %s in %v", r.URL.Path, time.Since(start))
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, world!"))
	})

	log.Println("Listening on :8080")
	http.ListenAndServe(":8080", loggingMiddleware(mux))
}`,
      usage: `### Usage\n\nThis example shows a basic Go web server using the standard library. The \`loggingMiddleware\` function wraps another \`http.Handler\`. To use it, simply pass your main router or handler to the middleware function when starting the server.\n\n\`\`\`go\n// Assuming 'mux' is your main http.ServeMux or router\nhttp.ListenAndServe(":8080", loggingMiddleware(mux))\n\`\`\``,
      tags: ['go', 'golang', 'api', 'middleware', 'logging'],
    },
  ];

  for (const snippet of snippets) {
    await prisma.snippet.upsert({
      where: { title: snippet.title },
      update: {},
      create: {
        ...snippet,
        authorId: adminUser.id,
      },
    });
  }
  console.log('Created snippets.');
  
  // --- DOCUMENTS ---
  const docs = [
    {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs-14',
      content: `
# Getting Started with Next.js 14

Next.js is a powerful React framework for building server-side rendered and static web applications. This guide covers the key features of the App Router introduced in Next.js 13 and stabilized in version 14.

## Installation

To create a new Next.js app, run the following command in your terminal:
\`\`\`bash
npx create-next-app@latest
\`\`\`

## Key Features

- **File-based Routing**: Create pages by adding files to the \`src/app\` directory. A file at \`src/app/dashboard/page.tsx\` will be accessible at \`/dashboard\`.
- **Server Components**: By default, components in the App Router are React Server Components. This reduces the amount of JavaScript sent to the client, improving performance.
- **Layouts**: Define a UI that is shared across multiple pages. A layout can also be nested.
- **API Routes**: Easily create API endpoints as "Route Handlers" by adding a \`route.ts\` file inside any app directory.
      `,
      tags: ['nextjs', 'react', 'tutorial', 'webdev', 'server-components'],
    },
     {
      title: 'Understanding Promises in JavaScript',
      slug: 'understanding-promises-in-javascript',
      content: `
# Understanding Promises in JavaScript

A \`Promise\` is an object representing the eventual completion or failure of an asynchronous operation. It allows you to write async code that is more readable and manageable than traditional callback-based approaches.

## States of a Promise

A Promise can be in one of three states:
- **Pending**: The initial state; neither fulfilled nor rejected.
- **Fulfilled**: The operation completed successfully.
- **Rejected**: The operation failed.

## Creating a Promise

You can create a new promise using the \`Promise\` constructor, which takes a function (the "executor") as an argument.

\`\`\`javascript
const myPromise = new Promise((resolve, reject) => {
  const success = true; // Simulate an async operation
  if (success) {
    resolve("The operation was successful!");
  } else {
    reject("The operation failed.");
  }
});
\`\`\`

## Consuming a Promise

You use the \`.then()\` and \`.catch()\` methods to handle the results of a promise.

\`\`\`javascript
myPromise
  .then((result) => {
    console.log(result); // "The operation was successful!"
  })
  .catch((error) => {
    console.error(error); // This won't run in our example
  });
\`\`\`

### Async/Await

A more modern and readable way to work with promises is using the \`async\` and \`await\` keywords.

\`\`\`javascript
async function handlePromise() {
  try {
    const result = await myPromise;
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

handlePromise();
\`\`\`
      `,
      tags: ['javascript', 'es6', 'promises', 'async', 'asynchronous'],
    },
    {
      title: 'A Guide to CSS Flexbox',
      slug: 'a-guide-to-css-flexbox',
      content: `
# A Guide to CSS Flexbox

Flexbox is a one-dimensional layout model that offers an efficient way to lay out, align, and distribute space among items in a container.

## The Container (\`display: flex\`)

To start using Flexbox, you need a container element.

\`\`\`css
.flex-container {
  display: flex;
}
\`\`\`

### Key Container Properties:

- **\`flex-direction\`**: Defines the direction of the main axis (\`row\`, \`row-reverse\`, \`column\`, \`column-reverse\`).
- **\`justify-content\`**: Aligns items along the main axis (\`flex-start\`, \`flex-end\`, \`center\`, \`space-between\`, \`space-around\`).
- **\`align-items\`**: Aligns items along the cross axis (\`flex-start\`, \`flex-end\`, \`center\`, \`stretch\`, \`baseline\`).
- **\`flex-wrap\`**: Allows items to wrap onto multiple lines (\`nowrap\`, \`wrap\`, \`wrap-reverse\`).

## The Items (Flex Items)

The direct children of the flex container are the flex items.

### Key Item Properties:

- **\`flex-grow\`**: Defines the ability for a flex item to grow if necessary.
- **\`flex-shrink\`**: Defines the ability for a flex item to shrink if necessary.
- **\`flex-basis\`**: Defines the default size of an element before the remaining space is distributed.
- **\`order\`**: Defines the order of the flex items.
      `,
      tags: ['css', 'flexbox', 'layout', 'web-design', 'frontend'],
    },
    {
      title: 'Setting Up a Basic Express.js Server',
      slug: 'setting-up-a-basic-expressjs-server',
      content: `
# Setting Up a Basic Express.js Server

Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

## Prerequisites
You need to have Node.js and npm (or yarn/pnpm) installed.

## Installation

1. Initialize a new project: \`npm init -y\`
2. Install Express: \`npm install express\`

## Creating the Server

Create a file named \`index.js\` and add the following code:

\`\`\`javascript
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(\`Example app listening at http://localhost:\${port}\`);
});
\`\`\`

## Running the Server

Run the following command in your terminal:

\`\`\`bash
node index.js
\`\`\`

You can now visit \`http://localhost:3000\` in your browser and you should see "Hello World!".
      `,
      tags: ['nodejs', 'expressjs', 'javascript', 'backend', 'api'],
    },
    {
      title: 'Introduction to Docker',
      slug: 'introduction-to-docker',
      content: `
# Introduction to Docker

Docker is an open platform for developing, shipping, and running applications. It enables you to separate your applications from your infrastructure so you can deliver software quickly.

## Key Concepts

- **Image**: A read-only template with instructions for creating a Docker container. An image is often based on another image, with some additional customization.
- **Container**: A runnable instance of an image. You can create, start, stop, move, or delete a container using the Docker API or CLI.
- **Dockerfile**: A text document that contains all the commands a user could call on the command line to assemble an image.

## Example Dockerfile

Here is a simple example of a Dockerfile for a Node.js application:

\`\`\`dockerfile
# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 3000, so you'll use the EXPOSE instruction
EXPOSE 3000

# Define the command to run your app
CMD [ "node", "server.js" ]
\`\`\`

This Dockerfile sets up a working directory, installs dependencies, copies the app source code, exposes a port, and defines the command to run the application.
      `,
      tags: ['docker', 'devops', 'containers', 'tutorial', 'infrastructure'],
    },
  ];

  for (const doc of docs) {
    await prisma.document.upsert({
      where: { slug: doc.slug },
      update: {},
      create: {
        ...doc,
        authorId: adminUser.id,
      },
    });
  }
  console.log('Created documents.');

  // --- MARKETPLACE COMPONENTS ---
  const components = [
    {
      title: "Animated Login Form",
      description: "A beautifully animated login form component built with Framer Motion and Tailwind CSS. Includes input fields for email and password, a submit button, and social login options. Fully responsive and easy to customize.",
      price: 1500, // Price in smallest currency unit (e.g., paise for INR)
      tags: ["react", "form", "animation", "auth", "tailwind"],
      previewUrls: ["https://picsum.photos/seed/loginform/600/400"],
      zipFileUrl: "/placeholder.zip",
      status: "approved",
      creatorId: adminUser.id,
    },
    {
      title: "Pricing Page with Toggle",
      description: "A responsive pricing page component with a monthly/yearly toggle switch. Built with React and Tailwind CSS.",
      price: 1000,
      tags: ["react", "pricing", "tailwind", "component"],
      previewUrls: ["https://picsum.photos/seed/pricing/600/400"],
      zipFileUrl: "/placeholder.zip",
      status: "approved",
      creatorId: adminUser.id,
    },
    {
      title: "Interactive Star Rating Component",
      description: "A reusable star rating component for React that allows users to select a rating. Includes support for half-stars and custom icons.",
      price: 500,
      tags: ["react", "component", "rating", "form-element"],
      previewUrls: ["https://picsum.photos/seed/rating/600/400"],
      zipFileUrl: "/placeholder.zip",
      status: "approved",
      creatorId: adminUser.id,
    },
  ];

  for (const component of components) {
    await prisma.component.upsert({
        where: { title: component.title },
        update: {},
        create: component
    });
  }
  console.log("Created marketplace components.");

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
