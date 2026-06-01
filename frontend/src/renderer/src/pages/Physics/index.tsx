import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'
import { fontWeight } from '../../design_token'
import { C } from './styles'
import { AtomsSection } from './sections/AtomsSection'
import { ElectronsSection } from './sections/ElectronsSection'
import { WaveSection } from './sections/WaveSection'
import { ExperimentSection } from './sections/ExperimentSection'
import { ResearchSection } from './sections/ResearchSection'

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${C.bg};
  animation: ${fadeIn} 0.3s ease;
`

const Layout = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 40px 80px;
  gap: 48px;
  align-items: flex-start;
`

const SideMenu = styled.div`
  position: sticky;
  top: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const BackButton = styled.button`
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: ${C.textSub};
  font-size: 0.9rem;
  border: 1px solid rgba(99, 102, 241, 0.28);
  border-radius: 999px;
  padding: 6px 16px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(99, 102, 241, 0.12);
    border-color: rgba(99, 102, 241, 0.6);
    color: #818cf8;
  }
`

const Toc = styled.nav`
  width: 200px;
  flex-shrink: 0;
`

const TocTitle = styled.p`
  font-size: 0.75rem;
  font-weight: ${fontWeight.semibold};
  color: ${C.textSub};
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
`

const TocItem = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  padding: 7px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
  border-left: 2px solid transparent;

  ${({ $active }) =>
    $active
      ? css`
          color: #818cf8;
          border-left-color: ${C.accent};
          background: rgba(99, 102, 241, 0.08);
          font-weight: ${fontWeight.semibold};
        `
      : css`
          color: ${C.textSub};
          &:hover {
            color: ${C.text};
            background: rgba(255, 255, 255, 0.04);
          }
        `}
`

const Content = styled.div`
  flex: 1;
  min-width: 0;
`

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: ${fontWeight.bold};
  color: ${C.text};
  letter-spacing: 0.02em;
  margin-bottom: 40px;
`

const Section = styled.section`
  margin-bottom: 40px;
  scroll-margin-top: 40px;
`

type TocId = 'atoms' | 'electrons' | 'wave' | 'experiment' | 'research'

export const Physics = (): React.ReactElement => {
  const navigate = useNavigate()
  const atomsRef = useRef<HTMLElement>(null)
  const electronsRef = useRef<HTMLElement>(null)
  const waveRef = useRef<HTMLElement>(null)
  const experimentRef = useRef<HTMLElement>(null)
  const researchRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState<TocId>('atoms')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id as TocId)
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    const allRefs = [atomsRef, electronsRef, waveRef, experimentRef, researchRef]
    for (const ref of allRefs) {
      if (ref.current) observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [atomsRef, electronsRef, waveRef, experimentRef, researchRef])

  const scrollTo = (id: TocId): void => {
    const map: Record<TocId, React.RefObject<HTMLElement | null>> = {
      atoms: atomsRef,
      electrons: electronsRef,
      wave: waveRef,
      experiment: experimentRef,
      research: researchRef
    }
    map[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <PageWrapper>
      <Layout>
        <SideMenu>
          <BackButton onClick={() => navigate('/')}>← 戻る</BackButton>
          <Toc>
            <TocTitle>目次</TocTitle>
            {(
              [
                { id: 'atoms', label: '原子と電子' },
                { id: 'electrons', label: '物質の中の電子' },
                { id: 'wave', label: '波動関数と電子密度' },
                { id: 'experiment', label: '実験で分かること' },
                { id: 'research', label: '本研究室の成果' }
              ] as { id: TocId; label: string }[]
            ).map(({ id, label }) => (
              <TocItem key={id} $active={activeId === id} onClick={() => scrollTo(id)}>
                {label}
              </TocItem>
            ))}
          </Toc>
        </SideMenu>

        <Content>
          <PageTitle>物理的な背景</PageTitle>
          <Section id="atoms" ref={atomsRef}>
            <AtomsSection />
          </Section>
          <Section id="electrons" ref={electronsRef}>
            <ElectronsSection />
          </Section>
          <Section id="wave" ref={waveRef}>
            <WaveSection />
          </Section>
          <Section id="experiment" ref={experimentRef}>
            <ExperimentSection />
          </Section>
          <Section id="research" ref={researchRef}>
            <ResearchSection />
          </Section>
        </Content>
      </Layout>
    </PageWrapper>
  )
}
