import { ImageKitAuthResponse } from "../types/imageKit.type";
import { getFirebaseToken } from "../../../shared/firebase/helpers/auth.helper";
import { imageKitApi } from "../api/imageKit.api";

// ? Function to request the image's authentication parameters from the backend
const getImageKitAuth = async (): Promise<ImageKitAuthResponse> => {
  const idToken = await getFirebaseToken();
  if (!idToken) throw new Error("The Firebase token could not be obtained");

  const response = await imageKitApi.get("/imagekit-auth", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return response.data;
};

export { getImageKitAuth };
