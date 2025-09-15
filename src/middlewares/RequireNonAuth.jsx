import { useEffect } from "react";
import Cookies from "universal-cookie";

function RequireNonAuth({ children }) {
  const cookies = new Cookies();
  const token = cookies.get("token");

  useEffect(() => {
    if (token) {
      location.pathname = "/";
    }
  }, []);

  return children;
}

export default RequireNonAuth;
