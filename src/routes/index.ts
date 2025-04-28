import { Router } from "express";
import { UserRoutes } from "../app/modules/user/user.route";
const router = Router();


const ModuleRoutes = [
    {
        path: "/auth",
        route: UserRoutes,
    }
  ];
  
  ModuleRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
  
  export default router;