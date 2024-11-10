import { ButtonLoading } from "./button-loading";
import { ButtonProps } from "./ui/button";

interface GradientButtonProps extends ButtonProps {
  fromColor: string;
  toColor: string;
  loading?: boolean;
}

const GradientButton = ({
  fromColor,
  toColor,
  className,
  children,
  ...rest
}: GradientButtonProps) => {
  return (
    <ButtonLoading
      {...rest}
      className={`${className} rounded px-4 py-2 text-white`}
      style={{
        background: `linear-gradient(to right, ${fromColor}, ${toColor})`,
      }}
    >
      {children}
    </ButtonLoading>
  );
};

export default GradientButton;
