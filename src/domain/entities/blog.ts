// Interface Blog
export interface IBlog {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  author?: string;
  image?: string;
  articles?: IArticle[]; // relation avec Article
}

// Interface Article
export interface IArticle {
  id: string;
  title?: string;
  image?: string;
  caption?: string;
  imageDescription?: string;
  blogId: string;
  blog?: IBlog; // relation inverse
}
