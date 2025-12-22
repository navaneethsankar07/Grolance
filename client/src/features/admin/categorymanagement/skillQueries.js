import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";

const fetchSkills = async () => {
  const res = await axiosInstance.get("/categories/skills/");
  return res.data;
};

export const useSkills = () => {
  return useQuery({
    queryKey: ["admin-skills"],
    queryFn: fetchSkills,
  });
};
