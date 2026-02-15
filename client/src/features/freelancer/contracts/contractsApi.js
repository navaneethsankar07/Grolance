import axiosInstance from "../../../api/axiosInstance";
import { uploadToCloudinary } from "../../../utils/cloudinaryHelper";

export const fetchAllContracts = async (params) => {
  const { data } = await axiosInstance.get("/contracts/", { params });
  return data;
};

export const postRevisionAction = async ({ revisionId, action, message }) => {
  const response = await axiosInstance.post(`/contracts/revisions/${revisionId}/action/`, {
    action,
    message,
  });
  return response.data;
};

export const fetchContractDetail = async (id) => {
  const { data } = await axiosInstance.get(`/contracts/${id}/`);
  return data;
};

export const submitContractWork = async ({ id, formData }) => {
  const { data } = await axiosInstance.post(
    `/contracts/${id}/submit-work/`, 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return data;
};



export const createDispute = async ({ contract, reason, description, files }) => {
  const uploadPromises = files.map(file => uploadToCloudinary(file));
  const uploadResults = await Promise.all(uploadPromises);
  const evidence_urls = uploadResults.map(result => result.secure_url);

  const { data } = await axiosInstance.post("/contracts/dispute/", {
    contract,
    reason,
    description,
    evidence_urls,
  });
  
  return data;
};