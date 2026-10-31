import { upload } from "@imagekit/react";
import { getImageKitAuth } from "@/features/auth/services/imageKit.service";
import { getUserId } from "@/shared/firebase/helpers/auth.helper";

export const useImageKit = () => {
  const uploadAvatar = async (file: File) => {
    try {
      const auth = await getImageKitAuth();

      const result = await upload({
        file,
        fileName: `${getUserId()}.jpg`,
        token: auth.token,
        expire: auth.expire,
        signature: auth.signature,
        publicKey: auth.publicKey,
        folder: "/avatars",
        overwriteFile: true,
        useUniqueFileName: false,
      });

      return result.url;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { uploadAvatar };
};
