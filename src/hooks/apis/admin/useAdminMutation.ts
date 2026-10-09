import { downloadAttachment } from "@/api/services/admin.api";
import { useMutation } from "@tanstack/react-query";

function useAdminMutation() {
  const attachmentDownloadMutation = useMutation({
    mutationKey: ["attachment_dowload"],
    mutationFn: (attachment_id: number) => downloadAttachment(attachment_id),
  });
  return {
    attachmentDownloadMutation,
  };
}

export default useAdminMutation;
