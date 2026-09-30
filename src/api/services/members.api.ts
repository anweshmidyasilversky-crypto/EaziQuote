import type {
  PageFilters,
  TeamMemberCreateApiPayload,
  TeamMemberUpdateApiPayload,
} from "@/types/api.requests.type";
import { axiosInstance } from "../axiosInstance";
import type {
  ApiResponse,
  ListResponse,
  TeamMember,
} from "@/types/api.responses.type";
import { API_ENDPOINTS } from "@/constants/endPoints";
import { ObjToFormData } from "@/lib/utils";

export const getTeamMemberList = async (filters: PageFilters) => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<ListResponse<TeamMember>>
    >(API_ENDPOINTS.teamMembers.memberList, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createTeamMember = async (payload: TeamMemberCreateApiPayload) => {
  try {
    const response = await axiosInstance.post<ApiResponse<TeamMember>>(
      API_ENDPOINTS.teamMembers.memberCreate,
      ObjToFormData(payload),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTeamMember = async (payload: TeamMemberUpdateApiPayload) => {
  try {
    const response = await axiosInstance.post<ApiResponse<TeamMember>>(
      API_ENDPOINTS.teamMembers.memberUpdate,
      ObjToFormData(payload),
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
