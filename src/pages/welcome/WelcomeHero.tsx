import type { CSSProperties } from "react";
import { IonIcon } from "@ionic/react";
import {
  bookOutline,
  footballOutline,
  musicalNotesOutline,
  restaurantOutline,
  timeOutline,
} from "ionicons/icons";

import { Avatar } from "../../shared/components/Avatar";
import { PlanCard } from "../../shared/components/PlanCard";
import { getCategory } from "../../shared/helpers/constants";
import type { PlanDoc } from "../../shared/types/plan.types";

interface PinProps {
  color: string;
  icon: string;
  //? Posición del centro-abajo de la gota, en % del mapa
  x: number;
  y: number;
  scale?: number;
}

//? Gota de 32 × 40 px (igual que los pines del mapa real)
const Pin = ({ color, icon, x, y, scale = 1 }: PinProps) => (
  <div
    className="absolute"
    style={
      {
        left: `${x}%`,
        top: `${y}%`,
        width: 32 * scale,
        height: 40 * scale,
        transform: "translate(-50%, -100%)",
      } as CSSProperties
    }
  >
    <svg viewBox="0 0 32 40" className="size-full drop-shadow-md">
      <path
        d="M16 0C7.2 0 0 7.1 0 15.8 0 27.5 16 40 16 40s16-12.5 16-24.2C32 7.1 24.8 0 16 0Z"
        fill={color}
      />
    </svg>
    <IonIcon
      icon={icon}
      className="absolute inset-x-0 mx-auto text-white"
      style={{ top: 7 * scale, fontSize: 16 * scale }}
    />
  </div>
);

//? Plan de ejemplo que se ve en la tarjeta flotante. Solo ilustra la app
const buildMockPlan = (): PlanDoc => {
  const now = Date.now();
  return {
    id: "welcome-demo",
    title: "Partido de fútbol 5",
    category: "deporte",
    location: { lat: 0, lng: 0, label: "Cancha del campus" },
    startAt: now - 10 * 60_000,
    expiresAt: now + 50 * 60_000,
    capacity: 6,
    creatorId: "demo",
    creatorName: "Laura",
    status: "active",
  };
};

const PEOPLE = ["Laura", "Andrés", "Camila"];

//? Ilustración decorativa: no es interactiva y no aporta información a lectores de pantalla
export const WelcomeHero = () => {
  const deporte = getCategory("deporte");
  const comida = getCategory("comida");
  const estudio = getCategory("estudio");
  const musica = getCategory("musica");

  return (
    <div
      aria-hidden="true"
      //@ts-expect-error `inert` aún no está tipado en esta versión de @types/react
      inert=""
      className="relative mb-14 h-[clamp(190px,36dvh,320px)] [@media(max-height:720px)]:h-[28dvh] w-full"
    >
      {/* Mapa */}
      <div className="rounded-card border-line bg-line/40 absolute inset-0 overflow-hidden border shadow-sm">
        <svg
          viewBox="0 0 342 280"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 size-full"
        >
          <rect
            x="196"
            y="18"
            width="110"
            height="78"
            rx="16"
            className="fill-success/15"
          />
          <rect
            x="18"
            y="196"
            width="70"
            height="50"
            rx="12"
            className="fill-success/10"
          />
          <g className="stroke-surface fill-none" strokeLinecap="round">
            <path d="M-10 108H352" strokeWidth="12" />
            <path d="M-10 200H352" strokeWidth="8" />
            <path d="M118 -10V290" strokeWidth="12" />
            <path d="M250 -10V290" strokeWidth="8" />
            <path d="M-10 270L352 140" strokeWidth="6" />
            <path d="M60 -10L170 108" strokeWidth="5" />
          </g>
        </svg>

        {/* Radio de búsqueda y ubicación del usuario */}
        <div
          className="border-secondary/30 bg-secondary/10 absolute size-28 rounded-full border"
          style={{
            left: "24%",
            top: "46%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute size-3.5 rounded-full border-2 border-white bg-[#2E90FA] shadow-md"
          style={{
            left: "24%",
            top: "46%",
            transform: "translate(-50%, -50%)",
          }}
        />

        <Pin color={comida.color} icon={restaurantOutline} x={10} y={36} />
        <Pin color={estudio.color} icon={bookOutline} x={50} y={38} />
        <Pin
          color={deporte.color}
          icon={footballOutline}
          x={62}
          y={52}
          scale={1.25}
        />
        <Pin color={musica.color} icon={musicalNotesOutline} x={88} y={48} />
      </div>

      {/* Personas que se unieron */}
      <div className="bg-surface absolute top-3 left-3 flex items-center gap-2 rounded-full py-1.5 pr-3 pl-1.5 shadow-lg">
        <div className="flex -space-x-1">
          {PEOPLE.map((name) => (
            <div key={name} className="ring-surface rounded-full ring-2">
              <Avatar name={name} size={24} />
            </div>
          ))}
          <div className="bg-line text-caption text-ink ring-surface flex max-[379px]:hidden size-6 items-center justify-center rounded-full ring-2">
            +4
          </div>
        </div>
        <span className="text-caption text-ink">7 se unieron</span>
      </div>

      {/* Caducidad del plan */}
      <div className="bg-accent text-caption text-ink absolute top-5 right-3 flex rotate-3 items-center gap-1 rounded-full px-3 py-1.5 shadow-lg">
        <IonIcon icon={timeOutline} />
        Termina en 1 h
      </div>

      {/* Tarjeta de plan, mitad dentro y mitad fuera del mapa */}
      <div className="absolute inset-x-3 -bottom-14 shadow-lg">
        <PlanCard plan={buildMockPlan()} count={3} distanceKm={0.35} />
      </div>
    </div>
  );
};
