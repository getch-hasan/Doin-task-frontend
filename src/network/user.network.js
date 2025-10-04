import { privateRequest } from "../config/axios.config";

export const index = async () => {
    return await privateRequest.get(`/users`);
};


export const getProfile = async () => {
  return await privateRequest.get("/me");
};