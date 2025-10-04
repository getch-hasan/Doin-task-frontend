import Cookies from "js-cookie";
import { Toastify } from "../../components/toastify";
/* Set token */
export const setToken = async (token) => {
  Cookies.set("task-token", token, { expires: 7, path: "/" }); // Set token with expiration (7 days) and path
  return true;
};

/* Get token */
export const getToken = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("task-token"); // Retrieve token from cookie
  }
};

/* Remove token */
export const removeToken = () => {
  Cookies.remove("task-token");
  return true;
};

/* Phone number valid check */
export const isValidPhone = () => {
  const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/i;
  return regex;
};

/* E-mail valid check */
export const isValidEmail = () => {
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regex;
};



export const networkErrorHandeller = (error) => {
  if (
    error ||
    error.response ||
    error.response.data ||
    error.response.data.errors
  ) {
    return Toastify.Error(
      error?.response?.data?.message || error?.response?.data?.error[0]
    );
  } else {
    return Toastify.Error("Something going wrong, Try again.");
  }
};
