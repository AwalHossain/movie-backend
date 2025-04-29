import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { AppError } from '../../../error/appError';
import catchAsyncError from '../../../shared/catchAsyncError';
import { sendResponse } from '../../../shared/sendResponse';
import { IReview } from './review.interface';
import { ReviewService } from './review.service';


const addReview = catchAsyncError(async (req: Request, res: Response) => {
 
  const userId = (req.user as any)?._id; 
  if (!userId) {
      throw new AppError('User not authenticated', httpStatus.UNAUTHORIZED);
  }

  const reviewData = req.body;
  const result = await ReviewService.addReview(userId, reviewData);

  sendResponse<IReview>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review added successfully',
    data: result,
  });
});


const getReviewsByMovieId = catchAsyncError(async (req: Request, res: Response) => {
  const movieId = req.params.movieId;
  const result = await ReviewService.getReviewsByMovieId(movieId);

  sendResponse<IReview[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews fetched successfully',
    data: result,
  });
});

export const ReviewController = {
  addReview,
  getReviewsByMovieId,
}; 