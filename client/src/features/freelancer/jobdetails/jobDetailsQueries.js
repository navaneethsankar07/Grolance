import { useQuery } from "@tanstack/react-query"
import { fetchJobDetails } from "./jobDetailsApi"

export const useProjectDetails = (projectId) => {
    return useQuery({
        queryKey: ['project', projectId],
        queryFn: () => fetchJobDetails(projectId),
        enabled: !!projectId,
        staleTime: 1000 * 60 * 5
    });
};