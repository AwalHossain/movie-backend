import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { AppError } from '../../../error/appError';
import { io } from '../../../server';
import { emitNewReview } from '../../../socket';
import { Movie } from '../movies/movie.model'; // Need to check if movie exists
import { IReview } from './review.interface';
import { Review } from './review.model';

// Add a new review
const addReview = async (userId: string, data: Partial<IReview>): Promise<IReview> => {

    if (!data.movieId || !data.rating) {
        throw new AppError('Movie ID (numeric TMDB ID) and rating are required', httpStatus.BAD_REQUEST);
    }


    const movieExists = await Movie.findOne({ _id: data.movieId });
    if (!movieExists) {
        throw new AppError(`Movie with TMDB ID ${data.movieId} not found`, httpStatus.NOT_FOUND);
    }

    const reviewPayload: Partial<IReview> = {
        ...data,
        movieId: movieExists._id,
        userId: new mongoose.Types.ObjectId(userId)
    };
    const newReview = await Review.create(reviewPayload);
    if (!newReview) {
        throw new AppError('Failed to add review', httpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
        const populatedReview = await Review.findById(newReview._id).populate('userId', 'name email');
        if (populatedReview) {
            emitNewReview(io, populatedReview.toObject());
        }
    } catch (error) {
        console.log('Socket emission error:', error);
    }

    return newReview;

};


const getReviewsByMovieId = async (movieId: string): Promise<IReview[]> => {
    console.log(movieId, "movieId in service");
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
        throw new AppError('Invalid Movie ID format (expected ObjectId)', httpStatus.BAD_REQUEST);
    }

    const reviews = await Review.find({ movieId: new mongoose.Types.ObjectId(movieId) })
        .sort({ createdAt: -1 })
        .populate("userId", "name email");

    if (!reviews) {
        throw new AppError('Could not fetch reviews', httpStatus.INTERNAL_SERVER_ERROR);
    }
    return reviews;
};



export const ReviewService = {
    addReview,
    getReviewsByMovieId,
}; 