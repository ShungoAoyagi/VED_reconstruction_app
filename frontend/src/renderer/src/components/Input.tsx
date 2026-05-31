import styled from 'styled-components'
import { fontSize, spacing } from '../design_token'

type InputProps = {
  error?: string
} & React.InputHTMLAttributes<HTMLInputElement>

const Wrapper = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
`

const StyledInput = styled.input<{ $hasError: boolean }>`
  font-size: ${fontSize.base};
  padding: ${spacing.sm} ${spacing.md};
  background: rgba(9, 13, 22, 0.8);
  color: #e6edf3;
  border: 1.5px solid
    ${({ $hasError }) =>
      $hasError ? '#f85149' : 'rgba(99, 102, 241, 0.3)'};
  border-radius: 8px;
  outline: none;
  transition: border-color 0.15s ease;
  width: 100%;

  &::placeholder {
    color: #8b949e;
  }

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? '#f85149' : '#6366f1'};
    box-shadow: 0 0 0 3px
      ${({ $hasError }) =>
        $hasError
          ? 'rgba(248, 81, 73, 0.15)'
          : 'rgba(99, 102, 241, 0.15)'};
  }
`

const ErrorMessage = styled.span`
  position: absolute;
  bottom: -1.25rem;
  left: 0;
  font-size: ${fontSize.xs};
  color: #f85149;
  white-space: nowrap;
`

export const Input = ({ error, ...rest }: InputProps) => (
  <Wrapper>
    <StyledInput $hasError={!!error} {...rest} />
    {error && <ErrorMessage>{error}</ErrorMessage>}
  </Wrapper>
)
