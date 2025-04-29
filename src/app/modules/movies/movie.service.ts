import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { AppError } from "../../../error/appError";
import { IMovie, IMovieFilters, IMoviePaginationOptions, IMovies } from "./movie.interface";
import { Movie } from "./movie.model"; // Correct path

const addMovie = async (data: Partial<IMovie>): Promise<IMovie> => {
  // Ensure required fields like title are present
  if (!data.title) {
    throw new AppError("Movie title is required", httpStatus.BAD_REQUEST);
  }


  // Create the movie
  const newMovie = await Movie.create(data);
  if (!newMovie) {
    throw new AppError("Failed to add movie", httpStatus.INTERNAL_SERVER_ERROR);
  }
  return newMovie;
};

const getAllMovies = async (filters: IMovieFilters, paginationOptions: IMoviePaginationOptions): Promise<IMovies> => {
  // Add sorting, pagination, filtering later as needed
  const {searchTerm, ...filtersData} = filters;
  const {page, skip, limit, sortBy, sortOrder} = paginationOptions;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: [
        {title: {$regex: searchTerm, $options: "i"}},
        {overview: {$regex: searchTerm, $options: "i"}},
      ],
    });
  }

  if(Object.keys(filtersData).length > 0) {
    Object.entries(filtersData).map(([key,value])=>{
      if(Array.isArray(value)) {
        andConditions.push({
          [key]: {$in: value}
        })
      } else {
        andConditions.push({
          [key]: value
        })
      }
    })
  }

  const sortConditions: {[key: string]: SortOrder} = {};
  if(sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder as SortOrder;
  }

  const whereConditions = andConditions.length > 0 ? {$and: andConditions} : {};

  const movies = await Movie.find(whereConditions)
    .sort(sortConditions)
    .skip(skip || 0)
    .limit(limit || 10);

  const total = await Movie.countDocuments(whereConditions);

  return {
    meta: {
      total,
      page: page || 1,
      limit: limit || 10
    },
    data: movies
  }
};

const getMovieById = async (id: string): Promise<IMovie> => {
  const movie = await Movie.findById(id);
  if (!movie) {
    throw new AppError("Movie not found", httpStatus.NOT_FOUND);
  }
  return movie;
};

// Find movie by TMDB ID
const getMovieByTmdbId = async (tmdbId: number): Promise<IMovie> => {
  const movie = await Movie.findOne({ tmdb_id: tmdbId });
  if (!movie) {
    throw new AppError(`Movie with TMDB ID ${tmdbId} not found`, httpStatus.NOT_FOUND);
  }
  return movie;
};


const deleteMovieById = async (id: string): Promise<IMovie> => {
  const deletedMovie = await Movie.findByIdAndDelete(id);
  if (!deletedMovie) {
    throw new AppError("Movie not found or failed to delete", httpStatus.NOT_FOUND);
  }
  return deletedMovie;
};

// Add update functionality later if needed
// const updateMovieById = async (id: string, data: Partial<IMovie>): Promise<IMovie | null> => {
//   const updatedMovie = await Movie.findByIdAndUpdate(id, data, { new: true }); // {new: true} returns the updated document
//   if (!updatedMovie) {
//     throw new AppError("Movie not found or failed to update", httpStatus.NOT_FOUND);
//   }
//   return updatedMovie;
// };

export const MovieService = {
  addMovie,          // Renamed from createMovie for clarity
  getAllMovies,
  getMovieById,      // Get by MongoDB _id
  getMovieByTmdbId,  // Get by TMDB ID
  deleteMovieById,
  // updateMovieById, // Uncomment when implemented
};
