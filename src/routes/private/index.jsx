import LayoutAdmin from "../../layout/admin";
import AdminCategory from "../../page/admin/category";
import DashBoard from "../../page/admin/dashboard";
import AdminProduct from "../../page/admin/product";
import AdminProductDetail from "../../page/admin/productDetail";
import AdminUser from "../../page/admin/users";
import PrivateRoute from "../protectedRouter/PrivateRoute";

const privateRoutes = [
    {
        path: "/admin",
        element: <PrivateRoute element={<LayoutAdmin />} />,
        children: [
          {
            index: true,
            element: <DashBoard />,
          },

          {
            path : "users",
            element : <AdminUser/>
          },
          {
            path : "category",
            element : <AdminCategory/>
          },
          {
            path : "product",
            element : <AdminProduct/>
          },
          {
            path : "productDetail",
            element : <AdminProductDetail/>
          },
        ]
    }
]

export default privateRoutes