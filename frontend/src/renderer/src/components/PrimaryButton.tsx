import styled from "styled-components";
import { colors, fontSize, spacing, borderRadius, fontWeight } from "../design_token";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const StyledButton = styled.button`
  background-color: ${colors.primary};
  color: ${colors.white};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.semibold};
  padding: ${spacing.sm} ${spacing.lg};
  border: none;
  border-radius: ${borderRadius.lg};
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
  user-select: none;

  &:hover {
    background-color: ${colors.primaryHover};
  }

  &:active {
    background-color: ${colors.primaryActive};
    transform: translateY(1px);
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background-color: ${colors.border};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const PrimaryButton = (props: PrimaryButtonProps) => {
  return <StyledButton {...props} />;
};
