export type User = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  bio?: string;
};

export type Tag = string;

export type Snippet = {
  id: string;
  author: User;
  description: string;
  code: string;
  language: string;
  tags: Tag[];
  likes: number;
  commentsCount: number;
  createdAt: string;
};
