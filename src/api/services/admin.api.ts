import { API_ENDPOINTS } from "@/constants/endPoints";
import { axiosInstance } from "../axiosInstance";

export const downloadAttachment = async (attachmentId: number) => {
  try {
    const fileBlob = await axiosInstance.get<Blob>(
      API_ENDPOINTS.admin.attachmentDownload(attachmentId),
      {
        responseType: "blob",
      },
    );
    return fileBlob.data;
  } catch (error) {
    throw error;
  }
};
