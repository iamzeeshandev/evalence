import { appApi } from "@/services/rtk-base-api-service";
import { FileResponse } from "./file-type";

const companyApi = appApi
  .enhanceEndpoints({
    addTagTypes: ["Company"],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      fileUpload: build.mutation<FileResponse, { image: File }>({
        query: (files) => {
          const formData = new FormData();
          formData.append("image", files.image);
          return {
            url: "/files/image",
            method: "POST",
            body: formData,
          };
        },
      }),
    }),
  });

export const { useFileUploadMutation } = companyApi;
