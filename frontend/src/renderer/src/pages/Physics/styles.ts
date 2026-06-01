import styled from 'styled-components'
import { fontWeight } from '../../design_token'

export const C = {
  bg: '#0D1117',
  card: '#1C2333',
  cardInner: '#161D2B',
  border: 'rgba(99, 102, 241, 0.22)',
  text: '#E6EDF3',
  textSub: '#BBD4DE',
  accent: '#6366F1',
  viewerBg: '#090D16'
} as const

export const SectionTitle = styled.h2`
  color: ${C.text};
  font-size: 1.1rem;
  font-weight: ${fontWeight.semibold};
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
`

export const ExplanationText = styled.p`
  color: ${C.textSub};
  font-size: 1rem;
  line-height: 1.7;
  margin-bottom: 16px;

  b {
    color: ${C.text};
    font-weight: ${fontWeight.semibold};
  }
`

export const PlaceholderText = styled.p`
  color: ${C.textSub};
  font-size: 1rem;
  line-height: 1.8;
  text-align: center;
  padding: 48px 0;
  border: 1px dashed rgba(99, 102, 241, 0.2);
  border-radius: 12px;
`
