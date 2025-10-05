import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../hook/useUser";


const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useUser();

  // If user not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route requires a specific role (like admin)
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-red-600">Access Denied 🚫</h1>
        <p className="text-gray-600 mt-2">
          You don’t have permission to view this page.
        </p>
      </div>
    );
  }

  // ✅ Authorized user — render children
  return children;
};

export default ProtectedRoute;
