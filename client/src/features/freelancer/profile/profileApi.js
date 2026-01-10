import axiosInstance from "../../../api/axiosInstance"

export const fetchFreelancerProfile = async ()=>{
    const res = await axiosInstance.get('/profile/freelancer/profile/');
    return res.data;
}