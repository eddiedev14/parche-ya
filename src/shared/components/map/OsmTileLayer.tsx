import { TileLayer } from "react-leaflet";

//? Teselas gratuitas de OpenStreetMap. La atribución es obligatoria por su licencia
export const OsmTileLayer = () => (
  <TileLayer
    attribution="&copy; OpenStreetMap contributors"
    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
);
