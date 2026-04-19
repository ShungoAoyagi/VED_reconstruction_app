import styled from "styled-components";
import { colors, fontSize, spacing, borderRadius, fontWeight } from "../design_token";

type SelectButtonProps = {
  selected: boolean;
  onSelect: () => void;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

const StyledSelectButton = styled.button<{ $selected: boolean }>`
  background-color: ${({ $selected }) =>
    $selected ? colors.primary : colors.white};
  color: ${({ $selected }) =>
    $selected ? colors.white : colors.primary};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.medium};
  padding: ${spacing.sm} ${spacing.lg};
  border: 2px solid ${colors.primary};
  border-radius: ${borderRadius.lg};
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  user-select: none;

  &:hover {
    background-color: ${({ $selected }) =>
      $selected ? colors.primaryHover : colors.background};
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    border-color: ${colors.border};
    color: ${colors.border};
    background-color: ${colors.white};
    cursor: not-allowed;
    transform: none;
  }
`;

export const SelectButton = ({
  selected,
  onSelect,
  ...rest
}: SelectButtonProps) => {
  return (
    <StyledSelectButton $selected={selected} onClick={onSelect} {...rest} />
  );
};
