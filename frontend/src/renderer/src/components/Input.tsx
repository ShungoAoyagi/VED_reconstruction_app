import styled from "styled-components";
import { colors, fontSize, spacing, borderRadius } from "../design_token";

type InputProps = {
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
`;

const StyledInput = styled.input<{ $hasError: boolean }>`
  font-size: ${fontSize.base};
  padding: ${spacing.sm} ${spacing.md};
  border: 2px solid ${({ $hasError }) =>
    $hasError ? colors.error : colors.border};
  border-radius: ${borderRadius.md};
  outline: none;
  transition: border-color 0.15s ease;
  width: 100%;

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? colors.error : colors.borderFocus};
  }
`;

const ErrorMessage = styled.span`
  position: absolute;
  bottom: -1.25rem;
  left: 0;
  font-size: ${fontSize.xs};
  color: ${colors.error};
  white-space: nowrap;
`;

export const Input = ({ error, ...rest }: InputProps) => {
  return (
    <Wrapper>
      <StyledInput $hasError={!!error} {...rest} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Wrapper>
  );
};
