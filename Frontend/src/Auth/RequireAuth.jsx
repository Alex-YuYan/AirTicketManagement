import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "./AuthProvider";
import { useContext } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const RequireAuth = () => {
  const { loggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  return loggedIn ? <Outlet /> : <Navigate to="/" />;
};

export default RequireAuth;
