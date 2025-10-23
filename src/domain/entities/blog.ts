import { IComment } from "./comment";

export interface Lng {
  en: string;
  fr: string;
}

// Interface Blog
export interface IBlog {
  id: string;
  title?: string | Lng;
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
  title?: string | Lng;
  image?: string;
  caption?: string | Lng;
  description?: string | Lng;
  blogId: string;
  blog?: IBlog; // relation inverse
  comments?: IComment[]
  likeCount?: number;
  dislikeCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}