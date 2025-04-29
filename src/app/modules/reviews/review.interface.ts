import { Types } from 'mongoose';


export interface IReview {
  _id?: Types.ObjectId;
  movieId: Types.ObjectId;
  userId: Types.ObjectId;
  rating: number;
  reviewText?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

