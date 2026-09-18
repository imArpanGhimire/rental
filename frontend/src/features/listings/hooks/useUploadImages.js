import { useMutation } from "@tanstack/react-query";

import { uploadImage } from "../../../api/listings.api.js";

export function useUploadImages() {
  return useMutation({
    mutationFn: (files) => Promise.all(files.map((file) => uploadImage(file))),
  });
}
