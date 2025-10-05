
import ProtectedRoute from "../components/hoc/protected";
import Dashboard from "../pages/Dashboard/Dashboard";

import Profile from "../pages/Profile";
import ResetPassword from "../pages/ResetPassword";
import TaskTable from "../pages/Tasks";
import TaskCreate from "../pages/Tasks/Create";
import TaskDetails from "../pages/Tasks/details";

import { getToken } from "../utils/helpers";

import { DashboardLayout } from './../layouts/dashboard.layout';
import TaskEdit from './../pages/Tasks/edit';

const appRoutes = [
  {
    path: "/dashboard",  // Ensure the path is absolute
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> }, 
      { path: "task", element: <TaskTable /> },
      { path: "task-details/:id", element: <TaskDetails /> },
      { path: "task-edit/:id", element: <ProtectedRoute><TaskEdit /></ProtectedRoute> },
      { path: "create-task", element: <ProtectedRoute><TaskCreate/></ProtectedRoute> },  
      { path: "profile", element: <Profile/> },  
      { path: "reset-password", element: <ResetPassword/> },
    ],
  },
];

export const permittedRoutes = () => {
  const token = getToken();
  if (token) {
    return appRoutes;
  }
  // return appRoutes;
  return [];
};
