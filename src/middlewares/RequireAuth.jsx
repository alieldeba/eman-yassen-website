import React from "react";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

function RequireAuth({ children }) {
  const cookies = new Cookies();
  const token = cookies.get("token");

  return <>{token ? children : <Navigate to="/login" replace={true} />}</>;
}

export default RequireAuth;
