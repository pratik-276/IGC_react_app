import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ProtectedRoute = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const user_id = localStorage.getItem("user_id");

  //   useEffect(() => {
  //     if (userType == 2 && location.pathname === "/Dealer_login") {
  //       navigate("/");
  //     }
  //   }, [userType, location.pathname]);

  const checkUser = () => {
    if (!user_id) {
      setIsLoggedIn(false);
      return navigate("/login");
    }
    setIsLoggedIn(true);
  };

  useEffect(() => {
    checkUser();
  }, [isLoggedIn]);

  return <>{isLoggedIn ? props.children : null}</>;
};

export default ProtectedRoute;
