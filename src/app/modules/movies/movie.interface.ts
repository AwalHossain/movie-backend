import { Document } from 'mongoose';

export interface ICastMember {
  name?: string | null;
  character?: string | null;
  profile_path?: string | null;
}

export interface IMovieFilters {
  searchTerm?: string;
  sourceCategory?: string;
  genre?: string;
  title?: string;
}



export interface IMoviePaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  skip?: number;
}

export interface IMovie {
  tmdb_id: number;
  title: string;
  overview?: string | null;
  release_date?: Date | null;
  tmdb_rating?: number | null;
  tmdb_vote_count?: number | null;
  runtime?: number | null;
  genres: string[];
  poster?: string | null;
  backdrop?: string | null;
  rating?: number | null;
  vote_count?: number | null;
  cast: ICastMember[];
  popularity?: number | null;
  source_category?: string | null;
  averageUserRating?: number | null;
  userReviewCount?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMovies {
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: IMovie[];
}


export interface IMovieSchema extends IMovie, Document { }