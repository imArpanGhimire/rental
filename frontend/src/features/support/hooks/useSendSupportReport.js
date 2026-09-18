import { useMutation } from "@tanstack/react-query";

import { sendSupportReport } from "../../../api/support.api.js";

export function useSendSupportReport() {
  return useMutation({ mutationFn: sendSupportReport });
}
