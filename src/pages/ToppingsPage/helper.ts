import { Products } from "../../types";

export const makeFormData = (data: Products): FormData => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "image") {
      const file = value.file as File;
      formData.append(key, file);
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};
