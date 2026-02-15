import axiosInstance from "../../../api/axiosInstance";

export const fetchTermsAndConditions = async () =>{
    const {data} = await axiosInstance.get('/common/public/terms-and-conditions/');
    return data;
}