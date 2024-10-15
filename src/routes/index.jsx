import { createBrowserRouter } from "react-router-dom";
import publicRoutes from "./public";
import privateRoutes from "./private";


const routes = createBrowserRouter([...publicRoutes,...privateRoutes]);

export default routes;
