import axiosInstance from "../../../api/axiosInstance";

export const getFreelancerList = async (params) => {
  const { data } = await axiosInstance.get("/profile/freelancers-list/", { 
    params 
  });
  return data;
};
export const fetchEligibleJobs = async () =>{
  const {data} = await axiosInstance.get('/projects/invitations/my-eligible-projects/')
  return data;
}

export const createInvitation = async (payload) =>{
   const {data} = await axiosInstance.post("/projects/invitations/",payload);
   return data;
}

export const getFreelancerDetails = async (id) => {
  const { data } = await axiosInstance.get(`/profile/freelancer/profile/${id}/`);
  return data;
};