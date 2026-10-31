import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { Toast } from "@/shared/classes/Toast.class";
import { Coordinates } from "@/shared/types/plan.types";

export const useCurrentLocation = () => {
  const [loading, setLoading] = useState(false);

  //? Devuelve null si el usuario niega el permiso o el GPS falla
  const getCurrentLocation = async (): Promise<Coordinates | null> => {
    setLoading(true);
    try {
      const { coords } = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });
      return { lat: coords.latitude, lng: coords.longitude };
    } catch {
      Toast.error("No pudimos obtener tu ubicación. Revisa el permiso.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, getCurrentLocation };
};
