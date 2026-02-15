import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, updateProfile } from "./profileApi";
import { useDispatch, useSelector } from "react-redux";
import {setCredentials} from '../../client/account/auth/authslice'

export const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { user: currentUser } = useSelector(state => state.auth);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedData) => {
      const updatedUser = {
        ...currentUser,
        ...updatedData, 
      };
      dispatch(setCredentials({ user: updatedUser }));

      queryClient.setQueryData(['profile'], (oldData) => {
        return {
          ...oldData,
          ...updatedData
        };
      });

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

