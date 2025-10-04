import { privateRequest } from "../config/axios.config";


/* list of resource */
export const index = async ({ page, per_page, status }) => {
  return await privateRequest.get("/task", {
    params: {
      page,
      per_page,
      ...(status ? { status } : {}), // only add status if provided
    },
  });
};




/* resource store */
export const store = async(data) => {
    return await privateRequest.post('/task', data)
}

/* resource show */
export const show = async(id) => {
    return await privateRequest.get(`task/${id}`)
}

/* reosurce update */
export const update = async(id, data) => {
    return await privateRequest.put(`/task/${id}`, data)
}

/* resource destory */
export const destroy = async (id) => {
    return await privateRequest.delete(`/task/${id}`)
}
