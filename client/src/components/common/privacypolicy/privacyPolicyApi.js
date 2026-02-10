import axiosInstance from "../../../api/axiosInstance";

export const fetchPrivacyPolicies = async () =>{
    const {data} = await axiosInstance.get('/common/public/privacy-policy/');
    return data;
}
