import axiosInstance from "../../../api/axiosInstance";

export const fetchSkills = ({page = 1,search = ""}) =>
  axiosInstance.get("/categories/skills/",{
    params:{page,search},
  });

export const createSkill = (data) =>
  axiosInstance.post("/categories/skills/create/", data);

export const updateSkill = (id, data) =>
  axiosInstance.patch(`/categories/skills/${id}/`, data);

export const deleteSkill = (id) =>
  axiosInstance.delete(`/categories/skills/${id}/`);
