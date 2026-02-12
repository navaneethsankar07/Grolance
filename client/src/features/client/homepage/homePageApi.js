import axiosInstance from "../../../api/axiosInstance";

export const switchRole = async ({ role }) => {
  const { data } = await axiosInstance.post(
    "/profile/switch-role/",
    { role }
  );
  return data;
};

export const fetchRecommendedFreelancers = async ()=>{
  const {data} = await axiosInstance.get('/profile/recommended-freelancers');
  return data;
}