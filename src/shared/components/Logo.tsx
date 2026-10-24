import logo from "../../assets/images/logo.svg";

interface Props {
  size?: number;
  className?: string;
}

//? Placeholder: reemplazar src/assets/images/logo.svg por el logo definitivo
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
