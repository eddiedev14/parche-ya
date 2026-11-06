import L from "leaflet";
import { getCategory, type CategoryId } from "@/shared/helpers/constants";

const PIN_WIDTH = 32;
const PIN_HEIGHT = 40;
const SELECTED_SCALE = 1.25;

//? Los íconos se crean una sola vez por categoría y estado: cada Marker recibe siempre la misma instancia
const cache = new Map<string, L.DivIcon>();

//? Gota del color de la categoría con el ícono en blanco. Se usa divIcon porque el ícono por defecto de Leaflet falla con Vite.
//? Al crecer, el pin escala desde la punta (transform-origin abajo al centro) para no moverse del lugar
export const getPlanPin = (categoryId: CategoryId, selected: boolean) => {
  const key = `${categoryId}:${selected}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const { color, icon } = getCategory(categoryId);
  const pin = L.divIcon({
    className: "",
    iconSize: [PIN_WIDTH, PIN_HEIGHT],
    iconAnchor: [PIN_WIDTH / 2, PIN_HEIGHT],
    html: `
      <div style="position:relative;width:${PIN_WIDTH}px;height:${PIN_HEIGHT}px;transform-origin:50% 100%;transform:scale(${selected ? SELECTED_SCALE : 1});transition:transform .15s">
        <svg width="${PIN_WIDTH}" height="${PIN_HEIGHT}" viewBox="0 0 32 40" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,.35))">
          <path d="M16 1C7.7 1 1 7.7 1 16c0 10.5 15 23 15 23s15-12.5 15-23C31 7.7 24.3 1 16 1z" fill="${color}" stroke="#fff" stroke-width="2"/>
        </svg>
        <img src="${icon}" alt="" style="position:absolute;left:8px;top:8px;width:16px;height:16px;filter:brightness(0) invert(1)" />
      </div>`,
  });

  cache.set(key, pin);
  return pin;
};

//? Punto azul de 14 px con borde blanco: la ubicación actual del usuario
export const USER_ICON = L.divIcon({
  className: "",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#2E90FA;border:2px solid #fff;box-sizing:border-box;box-shadow:0 0 0 1px rgba(0,0,0,.2)"></div>`,
});
