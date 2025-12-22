import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";

const fetchCategories = async () => {
  const res = await axiosInstance.get("/categories/");
  return res.data;
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });
};
