import { uploadAvatar as uploadAvatarRequest } from "@/features/auth/services/imageKit.service";

export const useImageKit = () => {
  const uploadAvatar = async (file: File) => {
    try {
      return await uploadAvatarRequest(file);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { uploadAvatar };
};
