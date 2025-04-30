import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated";
import { MovieController } from "./movie.controller";

const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  MovieController.addMovie
);


router.get("/", MovieController.getAllMovies);
router.get("/id/:id", MovieController.getMovieById);

router.delete(
  "/:id",
  isAuthenticated,
  MovieController.deleteMovieById
);

export const MovieRoutes = router; 