import axiosInstance from "../../../api/axiosInstance"

export const fetchJobDetails = async (id)=>{
const { data } = await axiosInstance.get(`/projects/${id}/details/`);
    return data;
};