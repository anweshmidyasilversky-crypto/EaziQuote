import { showErrorToast } from "@/api/axiosInstance";
import { sendEmail } from "@/api/services/quotes.api";
import { useQuery } from "@tanstack/react-query";

export type useSendEmailProps = {
  quote_id: string | number;
  enabled?: boolean;
};
function useSendEmail({ quote_id, enabled }: useSendEmailProps) {
  const { data, isFetching, error } = useQuery({
    queryKey: ["send_quote_email"],
    queryFn: () => sendEmail(quote_id),
    enabled,
  });

  if (error) {
    showErrorToast(error);
  }

  return {
    data,
    isSending: isFetching,
  };
}

export default useSendEmail;
