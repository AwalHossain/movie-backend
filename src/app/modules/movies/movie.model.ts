import { model, Schema } from "mongoose";
import { IMovie } from "./movie.interface";


const defaultPosterUrl = 'https://cdn.pixabay.com/photo/2023/08/06/06/08/ai-generated-8172236_960_720.png';
const defaultBackdropUrl = 'https://cdn.pixabay.com/photo/2017/07/13/23/11/cinema-2502213_960_720.jpg';
const defaultCastProfileUrl = 'https://cdn.pixabay.com/photo/2022/04/05/00/27/man-7112557_1280.jpg';



const movieSchema = new Schema<IMovie>(
  {
    tmdb_id: {
      type: Number,
      required: true,
      default: 0,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    overview: {
      type: String,
      trim: true,
      default: '',
    },
    release_date: {
      type: Date,
      default: null,
    },
    rating: {
      type: Number,
      default: 5,
    },
    vote_count: {
      type: Number,
      default: 0,
    },
    runtime: {
      type: Number,
      default: 0,
    },
    genres: {
      type: [String],
      trim: true,
      default: ["Drama"],
    },
    poster: {
      type: String,
      trim: true,
      default: defaultPosterUrl,
    },
    backdrop: {
      type: String,
      trim: true,
      default: defaultBackdropUrl,
    },
    cast: {
      type: [
        {
          _id: false,
          name: { type: String, default: 'Unknown Actor' },
          character: { type: String, default: 'Unknown Character' },
          profile_path: { type: String, default: defaultCastProfileUrl },
        },
      ],
      default: [],
    },
    popularity: {
      type: Number,
      default: 0,
    },
    source_category: {
      type: String,
      trim: true,
      index: true,
      default: '',
    },

    averageUserRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    userReviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Movie = model('Movie', movieSchema);
