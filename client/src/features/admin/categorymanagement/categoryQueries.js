import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";

const fetchCategories = async ({page = 1, search = ""}) => {
  const res = await axiosInstance.get("/categories/",{params:{page,search}});
  return res.data;
};

export const useCategories = ({page, search}) => {
  return useQuery({
    queryKey: ["admin-categories", page, search],
    queryFn: ()=> fetchCategories({page,search}),
    keepPreviousData:true
  });
};
