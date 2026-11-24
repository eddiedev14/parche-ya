import logo from "@/assets/images/logo.webp";

interface Props {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 96, className = "" }: Props) => {
  return (
    <img
      src={logo}
      alt="ParcheYa"
      width={size}
      height={size}
      className={className}
    />
  );
};
