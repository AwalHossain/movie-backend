import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { AppError } from '../../../error/appError';
import { Movie } from '../movies/movie.model'; // Need to check if movie exists
import { IReview } from './review.interface';
import { Review } from './review.model';

// Add a new review
const addReview = async (userId: string, data: Partial<IReview>): Promise<IReview> => {

    if (!data.movieId || !data.rating) {
        throw new AppError('Movie ID and rating are required', httpStatus.BAD_REQUEST);
    }


    const movieExists = await Movie.findById(data.movieId);
    if (!movieExists) {
        throw new AppError('Movie not found', httpStatus.NOT_FOUND);
    }

    data.userId = new mongoose.Types.ObjectId(userId);

    try {
        const newReview = await Review.create(data);
        if (!newReview) {
            throw new AppError('Failed to add review', httpStatus.INTERNAL_SERVER_ERROR);
        }

        return newReview;
    } catch (error: any) {
        if (error.code === 11000) {
            throw new AppError('You have already reviewed this movie', httpStatus.CONFLICT);
        }
        throw new AppError(
            error.message || 'An error occurred while adding the review',
            error.statusCode || httpStatus.INTERNAL_SERVER_ERROR
        );
    }
};


const getReviewsByMovieId = async (movieId: string): Promise<IReview[]> => {
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        throw new AppError('Invalid Movie ID format', httpStatus.BAD_REQUEST);
    }

    const reviews = await Review.find({ movieId: new mongoose.Types.ObjectId(movieId) })
        .sort({ createdAt: -1 });

    if (!reviews) {
        throw new AppError('Could not fetch reviews', httpStatus.INTERNAL_SERVER_ERROR);
    }

    return reviews;
};



export const ReviewService = {
    addReview,
    getReviewsByMovieId,
}; 