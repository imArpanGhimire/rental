import { useQuery } from "@tanstack/react-query";

import { getSecurityQuestionsList } from "../../../api/auth.api.js";

export function useSecurityQuestions() {
  return useQuery({
    queryKey: ["auth", "security-questions"],
    queryFn: getSecurityQuestionsList,
    staleTime: 60 * 60 * 1000,
    select: (data) => {
      const list = Array.isArray(data?.questions) ? data.questions : data;
      return (list || []).map((item) =>
        typeof item === "string" ? item : item.question,
      );
    },
  });
}
