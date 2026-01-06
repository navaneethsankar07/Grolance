import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendPhoneOtp, verifyPhoneOtp } from "./OnboardingAPI";

export const useSendPhoneOtp = () => {
  return useMutation({
    mutationFn: sendPhoneOtp,
  });
};

export const useVerifyPhoneOtp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyPhoneOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freelancer-profile"] });
    },
  });
};
