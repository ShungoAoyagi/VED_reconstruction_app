import styled from "styled-components";
import { colors, spacing, borderRadius } from "../design_token";

type IconType = "close" | "help" | "back";

type IconButtonProps = {
  icon: IconType;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const iconMap: Record<IconType, string> = {
  close: "\u00D7",
  help: "?",
  back: "\u2190",
};

const StyledIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: transparent;
  color: ${colors.text};
  font-size: 1.5rem;
  line-height: 1;
  border: 1px solid ${colors.border};
  border-radius: ${borderRadius.full};
  padding: ${spacing.xs};
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
  user-select: none;

  &:hover {
    background-color: ${colors.background};
    border-color: ${colors.primary};
    color: ${colors.primary};
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const IconButton = ({ icon, ...rest }: IconButtonProps) => {
  return (
    <StyledIconButton aria-label={icon} {...rest}>
      {iconMap[icon]}
    </StyledIconButton>
  );
};
