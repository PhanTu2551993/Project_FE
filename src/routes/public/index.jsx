import Home from "../../page/home";
import Login from "../../page/login";
import Register from "../../page/register";

const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  // {
  //   path: "/about",
  //   element: <About />,
  // },
  // {
  //   path: "/contact",
  //   element: <Contact />,
  // },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
];

export default publicRoutes;

