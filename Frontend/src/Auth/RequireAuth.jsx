import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "./AuthProvider";
import { useContext } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RequireCustomerAuth = () => {
  const { loggedIn, loading, userRole } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (loggedIn && userRole === 'customer') ? <Outlet /> : <Navigate to="/" />;
};

const RequireStaffAuth = () => {
  const { loggedIn, loading, userRole } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return (loggedIn && userRole === 'staff') ? <Outlet /> : <Navigate to="/" />;
};

export { RequireCustomerAuth, RequireStaffAuth };
