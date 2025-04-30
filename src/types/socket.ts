import { Socket } from 'socket.io';
import { IMovie } from '../app/modules/movies/movie.interface';
import { IReview } from '../app/modules/reviews/review.interface';


export interface ClientToServerEvents {

    authenticate: (userId: string) => void;
    'review:new': (review: Partial<IReview>) => void;
    'movie:new': (movie: Partial<IMovie>) => void;
}


export interface ServerToClientEvents {
    [key: `movie:${string}:review`]: (review: Partial<IReview>) => void;
    'movie:added': (movie: Partial<IMovie>) => void;
}

export interface InterServerEvents {
    ping: () => void;
}


export interface SocketData {
    userId?: string;
    authenticated: boolean;
}

export type CustomSocket = Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>; 