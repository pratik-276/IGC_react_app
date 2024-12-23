import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { IoIosArrowForward } from "react-icons/io";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./config";
import UserLogin from "../../services/Login";
import toast from "react-hot-toast";

const Verify = () => {
  const [value, setValue] = useState("Email Verification Pending ...");
  const [searchParams, setSearchParams] = useSearchParams();

  
  useEffect(() => {
    console.log(searchParams.get("user"));
    const user_id = searchParams.get("user").split("_igc_")[0];
    const user_email = searchParams.get("user").split("_igc_")[1];
    verifyEmail(user_id, user_email);
  }, []);

  const verifyEmail = (user_id, user_email) => {
    UserLogin.verify({ user_email: user_email, user_id: user_id })
        .then((res) => {
          if (res?.success === true) {
            setValue(res.message);
          }
        })
        .catch((err) => {
          toast.error(err, {
            duration: 10000,
          });
          setValue(err);
          if (err.response && err.response.status === 401) {
            toast.error("Unauthorized. Please check your credentials.");
          }
        });
  };


  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h4>{value}</h4>
            <p>{
              value === "Email Verification Successful" && (
                <> 
                    <Link to="/login" className="btn btn-primary mt-5">
                        Click here to login 
                    </Link> 
                </>
              )
            }</p>
        </div>
      </div>
    </>
  );
};

export default Verify;
