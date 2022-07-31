import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { toast } from "react-toastify";

import { usersRoute } from "../utils/APIs.js";
import toastConfig from "../utils/toastConfig.js";

const Signup = () => {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");

  const storageUser = useMemo(() => {
    const user = localStorage.getItem("yamess-user");
    if (user) return JSON.parse(user);
  }, []);

  useEffect(() => {
    if (storageUser) navigate("/yamess");
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { name, password } = Object.fromEntries(formData);

    if (name.length < 3 || name.length > 8)
      return toast.error("Please choose a username 3-8 characters long!", toastConfig);
    if (password.length < 6) return toast.error("Your password must be at least 6 characters!", toastConfig);

    try {
      await axios.post(usersRoute.signUp, {
        name,
        password,
      });
      toast.success("Your account has been created successfully!", toastConfig);
      navigate("/yamess/signin");
    } catch (error) {
      toast.error(error.response.data.message, toastConfig);
    }
  };

  const handleTogglePasswordType = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <div className="h-[32rem] w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg 2xl:h-[40rem] 2xl:max-w-5xl">
      <div className="flex h-full">
        <div className="mr-8 flex flex-grow flex-col justify-between">
          <div className="flex items-center">
            <div className="flex items-center text-3xl text-blue-500">
              <ion-icon name="rocket"></ion-icon>
            </div>
            <div className="text-3xl font-bold text-slate-600">
              Ya
              <span className="text-slate-400">mess</span>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <div className="text-4xl font-bold text-slate-600">Create new account</div>
            <div className="mt-1 flex">
              <div className="mr-2 font-bold uppercase text-slate-400">Already a member?</div>
              <Link to="/yamess/signin">
                <div className="cursor-pointer font-bold uppercase text-blue-500 hover:text-blue-600">Sign in</div>
              </Link>
            </div>
            <form id="form" onSubmit={handleSubmit} className="mt-8">
              <div>
                <div className="text-sm font-bold text-slate-400">Name</div>
                <input
                  name="name"
                  className="w-full border-b p-4 font-light text-slate-400 placeholder:text-slate-300 focus:outline-none"
                  type="text"
                  placeholder="Enter your name"
                  autoComplete="off"
                  autoFocus
                />
              </div>
              <div className="mt-4">
                <div className="text-sm font-bold text-slate-400">Password</div>
                <div className="relative">
                  <input
                    name="password"
                    className="w-full border-b p-4 font-light text-slate-400 placeholder:text-slate-300 focus:outline-none"
                    type={passwordType}
                    placeholder="Enter your password"
                    autoComplete="off"
                  />
                  <div
                    onClick={handleTogglePasswordType}
                    className="transfrom absolute bottom-1 right-0 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-xl text-slate-300"
                  >
                    {passwordType === "password" ? (
                      <ion-icon name="eye"></ion-icon>
                    ) : (
                      <ion-icon name="eye-off"></ion-icon>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
          <button
            type="submit"
            form="form"
            className="flex w-fit cursor-pointer self-center rounded-full bg-blue-500 px-6 py-4 text-white hover:bg-blue-600"
          >
            <div className="mr-2 flex items-center text-xl">
              <ion-icon name="log-in"></ion-icon>
            </div>
            <div className="font-bold ">Create account</div>
          </button>
        </div>
        <div className="w-96 overflow-hidden rounded-lg bg-slate-300 2xl:w-[28rem]">
          <img className="h-full w-full object-cover" src="./assets/images/signup.png" alt="image" />
        </div>
      </div>
    </div>
  );
};

export default Signup;
