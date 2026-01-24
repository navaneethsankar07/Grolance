import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/axiosInstance";
import { fetchAllCategories } from "./categoryApi";

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


export const useAllCategories = () => {
  return useQuery({
    queryKey: ["all-categories-list"],
    queryFn: fetchAllCategories,
    staleTime: 1000 * 60 * 30, 
  });
};