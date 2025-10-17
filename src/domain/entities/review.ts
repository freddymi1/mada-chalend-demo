import { IUser } from "./user";

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: string;
  titre: string;
  description: string;
  note: number;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: IUser;
}

export interface CreateReviewInput {
  titre: string;
  description: string;
  note: number;
  userId: string;
  status?: ReviewStatus;
}