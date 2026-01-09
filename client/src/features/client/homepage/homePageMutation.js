// authMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { switchRole } from "./homePageApi";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../account/auth/authslice";

export const useSwitchRole = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return useMutation({
    mutationFn: switchRole,
    onSuccess: (res) => {
      dispatch(
        setCredentials({
          user: {
            ...user,
            current_role: res.current_role,
          },
        })
      );

      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });
};
