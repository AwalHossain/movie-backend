import { Router } from "express";
import { MovieRoutes } from "../app/modules/movies/movie.route";
import { ReviewRoutes } from "../app/modules/reviews/review.route";
import { UserRoutes } from "../app/modules/user/user.route";

const router = Router();

const ModuleRoutes = [
    {
        path: "/auth",
        route: UserRoutes,
    },
    {
        path: "/movies",
        route: MovieRoutes,
    },
    {
        path: "/reviews",
        route: ReviewRoutes,
    }
];
  
ModuleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
  
export default router;