import { privateRequest } from "../config/axios.config";

/* list of resource */
export const index = async () => {
    return await privateRequest.get(`/users/me`);
};
export const update = async (data) => {
    return await privateRequest.post(`/vendor/update-profile`,data);
};



