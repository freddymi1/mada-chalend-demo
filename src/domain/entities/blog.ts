import { IComment } from "./comment";

// Interface Blog
export interface IBlog {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  author?: string;
  image?: string;
  articles?: IArticle[]; // relation avec Article
  comments?: IComment[]
}

// Interface Article
export interface IArticle {
  id: string;
  title?: string;
  image?: string;
  caption?: string;
  description?: string;
  blogId: string;
  blog?: IBlog; // relation inverse
  comments?: IComment[]
  likeCount?: number;
  dislikeCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
