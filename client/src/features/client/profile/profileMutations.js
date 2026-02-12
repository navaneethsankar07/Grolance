import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, updateProfile } from "./profileApi";
import { useDispatch, useSelector } from "react-redux";
import {setCredentials} from '../../client/account/auth/authslice'

export const useUpdateProfile = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {user:currentUser} = useSelector(state=>state.auth)

  return useMutation({
    mutationFn: updateProfile,

    onSuccess: (updatedData) => {

      const updatedUser = {
        ...currentUser,
        full_name:updatedData.full_name,
        profile_photo:updatedData.profile_photo,
      }
      dispatch(setCredentials({ user: updatedUser }));
      queryClient.setQueriesData(['profile'],updatedData)
      queryClient.invalidateQueries({ queryKey: ["profile"],refetchType:'none' });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

