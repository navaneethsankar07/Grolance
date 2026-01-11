import axiosInstance from "../../../api/axiosInstance"

export const fetchFreelancerProfile = async ()=>{
    const res = await axiosInstance.get('/profile/freelancer/profile/');
    return res.data;
}

export const updateProfile = async (data) => {
    const res = await axiosInstance.patch('/profile/freelancer/profile/', data);
    return res.data;
}