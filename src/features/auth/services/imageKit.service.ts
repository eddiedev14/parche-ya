import { getFirebaseToken } from "@/shared/firebase/helpers/auth.helper";
import { imageKitApi } from "@/features/auth/api/imageKit.api";

// ? Function to send the profile photo to the backend, which uploads it to ImageKit
const uploadAvatar = async (file: File): Promise<string> => {
  const idToken = await getFirebaseToken();
  if (!idToken) throw new Error("The Firebase token could not be obtained");

  //? El cuerpo es la imagen cruda (sin multipart): el backend la lee tal cual
  const response = await imageKitApi.post<{ url: string }>(
    "/upload-avatar",
    file,
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "image/jpeg",
      },
    },
  );

  return response.data.url;
};

export { uploadAvatar };
