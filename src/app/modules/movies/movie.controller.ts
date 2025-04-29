import { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../../error/appError";
import catchAsync from "../../../shared/catchAsyncError";
import pick from "../../../shared/pick";
import { sendResponse } from "../../../shared/sendResponse";
import { MovieService } from "./movie.service";

const addMovie = catchAsync(async (req: Request, res: Response) => {

  const result = await MovieService.addMovie(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Movie added successfully!",
    data: result,
  });
});

const getAllMovies = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, ['searchTerm', 'sourceCategory']);
  const paginationOptions = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
  console.log("filters", filters);
  console.log("paginationOptions", paginationOptions);
  const result = await MovieService.getAllMovies(filters, paginationOptions);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Movies retrieved successfully!",
    data: result,
  });
});

const getMovieById = catchAsync(async (req: Request, res: Response) => {
  const result = await MovieService.getMovieById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Movie retrieved successfully!",
    data: result,
  });
});

const getMovieByTmdbId = catchAsync(async (req: Request, res: Response) => {
  const tmdbId = parseInt(req.params.tmdbId, 10);
  if (isNaN(tmdbId)) {
    throw new AppError("Invalid TMDB ID provided", httpStatus.BAD_REQUEST);
  }
  const result = await MovieService.getMovieByTmdbId(tmdbId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Movie retrieved successfully by TMDB ID!",
    data: result,
  });
});

const deleteMovieById = catchAsync(async (req: Request, res: Response) => {
  const result = await MovieService.deleteMovieById(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Movie deleted successfully!",
    data: result,
  });
});


export const MovieController = {
  addMovie,
  getAllMovies,
  getMovieById,
  getMovieByTmdbId,
  deleteMovieById,
};
