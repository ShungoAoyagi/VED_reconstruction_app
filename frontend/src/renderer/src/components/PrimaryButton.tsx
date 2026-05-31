import styled from 'styled-components'
import { fontWeight } from '../design_token'

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const StyledButton = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  color: #ffffff;
  font-size: 1rem;
  font-weight: ${fontWeight.semibold};
  padding: 11px 28px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  letter-spacing: 0.03em;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
  transition:
    box-shadow 0.2s ease,
    transform 0.1s ease;
  user-select: none;

  &:hover:not(:disabled) {
    box-shadow: 0 6px 22px rgba(99, 102, 241, 0.52);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  }

  &:disabled {
    background: linear-gradient(
      135deg,
      rgba(71, 85, 105, 0.5) 0%,
      rgba(51, 65, 85, 0.5) 100%
    );
    box-shadow: none;
    cursor: not-allowed;
    color: #8b949e;
  }
`

export const PrimaryButton = (props: PrimaryButtonProps) => <StyledButton {...props} />
