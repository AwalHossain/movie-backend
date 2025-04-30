import { Server } from 'socket.io';
import { IMovie } from './app/modules/movies/movie.interface';
import { IReview } from './app/modules/reviews/review.interface';
import { logger } from './shared/logger';
import { ClientToServerEvents, CustomSocket, ServerToClientEvents } from './types/socket';

interface ConnectedUser {
    socketId: string;
    userId: string;
}

const connectedUsers: ConnectedUser[] = [];

export const initSocketServer = (io: Server<ClientToServerEvents, ServerToClientEvents>): void => {
    logger.info('Initializing Socket.IO server');

    io.on('connection', (socket: CustomSocket) => {
        logger.info(`New client connected: ${socket.id}`);

        socket.data.authenticated = false;

        socket.on('authenticate', (userId: string) => {
            if (userId) {
                const existingIndex = connectedUsers.findIndex(u => u.userId === userId);
                if (existingIndex !== -1) {
                    connectedUsers.splice(existingIndex, 1);
                }

                // Add new connection
                connectedUsers.push({ socketId: socket.id, userId });

                // Update socket data
                socket.data.userId = userId;
                socket.data.authenticated = true;

                logger.info(`User authenticated: ${userId}, total connected: ${connectedUsers.length}`);
            }
        });

        // Handle review creation
        socket.on('review:new', (data) => {
            logger.info(`New review event received for movie: ${data.movieId}`);
            socket.broadcast.emit(`movie:${data.movieId}:review`, data);
        });

        // Handle movie addition
        // socket.on('movie:new', (data) => {
        //     logger.info(`New movie added: ${data.title}`);
        //     io.emit('movie:added', data);
        // });

        // Handle disconnection
        socket.on('disconnect', () => {
            const index = connectedUsers.findIndex(user => user.socketId === socket.id);
            if (index !== -1) {
                const user = connectedUsers[index];
                connectedUsers.splice(index, 1);
                logger.info(`User disconnected: ${user.userId}, remaining: ${connectedUsers.length}`);
            } else {
                logger.info(`Socket disconnected: ${socket.id}`);
            }
        });
    });
};

// Utility functions for emitting events
export const emitNewReview = (io: Server<Record<string, any>, Record<string, any>>, review: Partial<IReview>): void => {
    if (review && review.movieId) {
        logger.info(`Emitting new review for movie: ${review.movieId}`);
        io.emit(`movie:${review.movieId}:review`, review);
        io.emit('movie:review', review);
    }
};

export const emitNewMovie = (io: Server<Record<string, any>, Record<string, any>>, movie: Partial<IMovie>): void => {
    logger.info(`Emitting new movie: ${movie.title}`);
    io.emit('movie:added', movie);
}; 