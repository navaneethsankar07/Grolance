import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "./categoryApi";

export const useSkills = ({page, search}) =>
  useQuery({
    queryKey: ["admin-skills",page,search],
    queryFn: ()=>fetchSkills({page,search}),
    select: (res) => res.data,
    keepPreviousData:true
  });
