import axiosInstance from "../../../api/axiosInstance";

export const fetchCategories = async () => {
  const res = await axiosInstance.get("/categories/");
  return res.data;
};

export const fetchSkills = async () => {
  const res = await axiosInstance.get("/categories/skills/");
  return res.data;
};
export const fetchAllSkills = async () => {
  const res = await axiosInstance.get("/categories/skills/",{params: {no_pagination: 'true'}});
  return res.data;
};

export const fetchAllCategories = async () => {
  const res = await axiosInstance.get("/categories/", {params: {no_pagination: 'true'}});
  
  return res.data; 
};

export const createProject = async (data) => {
  const res = await axiosInstance.post("/projects/create/", data);
  return res.data;
};

export const fetchMyProjects = async ({queryKey}) => {

const [_key, { page, status, search }] = queryKey;

  const res = await axiosInstance.get("/projects/", {
    params: {
      page,
      status,
      search,
    },
  });

  return res.data;
};

export const fetchProjectById = async (id) => {
  console.log(id);
  
  const res = await axiosInstance.get(`/projects/${id}/`);
  console.log(res.data,'babu');
  
  return res.data;
};

export const updateProject = async ({id,data}) => {
  const res = await axiosInstance.patch(`/projects/${id}/`,data);
  return res.data;
};

export const deleteProject = async ({id}) =>{
  const res = await axiosInstance.delete(`/projects/${id}/`);
  return res.data;
}