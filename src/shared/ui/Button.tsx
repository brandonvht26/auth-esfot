import { Button as TamaguiButton, Spinner } from "tamagui";
import { theme } from "@/core/styles/theme";

interface ButtonProps {
  onPress:    () => void;
  label:      string;
  isLoading?: boolean;
  variant?:   "primary" | "ghost" | "danger";
  disabled?:  boolean;
}

const variantMap = {
  primary: { backgroundColor: theme.colors.primary, color: "#fff", borderWidth: 0 },
  ghost:   { backgroundColor: "transparent", color: theme.colors.primary, borderWidth: 2, borderColor: theme.colors.primary },
  danger:  { backgroundColor: theme.colors.danger, color: "#fff", borderWidth: 0 },
} as const;

export const Button = ({
  onPress, label, isLoading, variant = "primary", disabled
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;
  const v = variantMap[variant];

  return (
    <TamaguiButton
      onPress={onPress}
      disabled={isDisabled}
      opacity={isDisabled ? 0.5 : 1}
      backgroundColor={v.backgroundColor}
      borderWidth={v.borderWidth}
      borderColor={"borderColor" in v ? (v as any).borderColor : undefined}
      borderRadius={12}
      paddingVertical={14}
      paddingHorizontal={24}
      animation="bouncy"
      pressStyle={{ scale: 0.95, opacity: 0.8 }}
      color={v.color}
    >
      {isLoading ? <Spinner color={v.color} /> : label}
    </TamaguiButton>
  );
};
