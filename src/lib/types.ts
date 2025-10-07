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
  title: string;
  description: string;
  code: string;
  language: string;
  tags: Tag[];
  likes: number;
  commentsCount: number;
  createdAt: string;
};

export type UIComponent = {
  id: string;
  name: string;
  description: string;
  author: User;
  code: string;
  tags: Tag[];
  likes: number;
  createdAt: string;
};

export type Doc = {
  id: string;
  title: string;
  slug: string;
  author: User;
  content: string;
  tags: Tag[];
  likes: number;
  commentsCount: number;
  createdAt: string;
};

export type BugReport = {
  id: string;
  title: string;
  description: string;
  reporter: User;
  upvotes: number;
  commentsCount: number;
  createdAt: string;
  status: 'Open' | 'In Progress' | 'Closed';
};
