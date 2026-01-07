import axiosInstance from "../../../api/axiosInstance"

export const fetchRecommendedProjects = async()=>{
    const {data} = await axiosInstance.get('profile/freelancer/recommended-projects/');
    return data;
}