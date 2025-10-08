"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function searchGlobal(query: string) {
  const session = await auth();
  const currentUserId = session?.user?.id;

  if (!query) return { users: [], snippets: [], docs: [] };

  const [users, snippets, docs] = await Promise.all([
    db.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { username: { contains: query, mode: "insensitive" } },
            ],
          },
        ],
      },
      take: 5,
    }),
    db.snippet.findMany({
      where: {
        visibility: "public",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { has: query.toLowerCase() } },
        ],
      },
      include: {
        author: true,
      },
      take: 5,
    }),
    db.document.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { tags: { has: query.toLowerCase() } },
        ],
      },
      include: {
        author: true,
      },
      take: 5,
    }),
  ]);

  return { users, snippets, docs };
}
