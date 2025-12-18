import axiosInstance from "../../../api/axiosInstance";

export const fetchCategories = async () => {
  const res = await axiosInstance.get("/categories/");
  return res.data;
};

export const fetchSkills = async () => {
  const res = await axiosInstance.get("/categories/skills/");
  return res.data;
};

export const createProject = async (data) => {
  const res = await axiosInstance.post("/projects/create/", data);
  return res.data;
};