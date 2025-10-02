import { IArticle, IBlog } from "./blog";
import { IUser } from "./user";


export interface IComment {
  id: string;
  content: string;
  userId?: string;
  user?: IUser;

  parentId?: string;
  parent?: IComment;
  replies?: IComment[];

  blogId?: string;
  blog?: IBlog;

  articleId?: string;
  article?: IArticle;

  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}
