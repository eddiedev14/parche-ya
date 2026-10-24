import { useState } from "react";

interface Props {
  url?: string | null;
  name: string;
  size?: number;
}

//? Sin ámbar: el texto blanco no tendría buen contraste
const FALLBACK_COLORS = [
  "#E8481F",
  "#22B07D",
  "#5B3DF5",
  "#D946A8",
  "#2E90FA",
  "#14B8A6",
];

//? El mismo nombre siempre da el mismo color
const getColor = (name: string) => {
  const hash = [...name].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length];
};

export const Avatar = ({ url, name, size = 40 }: Props) => {
  const [failed, setFailed] = useState(false);
  const showPhoto = !!url && !failed;

  if (showPhoto) {
    return (
      <img
        src={url}
        alt={name}
        width={size}
        height={size}
        onError={() => setFailed(true)}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={name}
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white select-none"
      style={{
        width: size,
        height: size,
        backgroundColor: getColor(name),
        fontSize: Math.round(size * 0.4),
      }}
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </div>
  );
};
