
import Dashboard from "../pages/Dashboard/Dashboard";
import Products from "../pages/products";
import ProductCreate from "../pages/products/Create";
import ProductUpdate from "../pages/products/edit";
import Profile from "../pages/Profile";
import ResetPassword from "../pages/ResetPassword";

import { DashboardLayout } from './../layouts/dashboard.layout';

const appRoutes = [
  {
    path: "/dashboard",  // Ensure the path is absolute
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },  // This will render at /dashboard
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductUpdate /> },
      
      { path: "create-product", element: <ProductCreate/> },  
      
      { path: "profile", element: <Profile/> },  
      { path: "reset-password", element: <ResetPassword/> },
    ],
  },
];

export const permittedRoutes = () => {
  // const token = getToken();
  // if (token) {
  //   return appRoutes;
  // }
  return appRoutes;
  // return [];
};
