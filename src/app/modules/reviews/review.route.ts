import express from 'express';

import isAuthenticated from '../../middlewares/isAuthenticated';
import { ReviewController } from './review.controller';

const router = express.Router();


router.post(
  '/',
  isAuthenticated ,
  ReviewController.addReview
);


router.get(
  '/movie/:movieId',
  ReviewController.getReviewsByMovieId
);


export const ReviewRoutes = router; 