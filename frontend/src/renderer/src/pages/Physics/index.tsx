import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'
import { fontWeight } from '../../design_token'
import { PeriodicTable } from '../../components/PeriodicTable'

const C = {
  bg: '#0D1117',
  card: '#1C2333',
  border: 'rgba(99, 102, 241, 0.22)',
  text: '#E6EDF3',
  textSub: '#BBD4DE',
  accent: '#6366F1'
} as const

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

const PageWrapper = styled.div`
  min-height: 100vh;
  background: ${C.bg};
  animation: ${fadeIn} 0.3s ease;
`

const BackButtonWrapper = styled.div`
  padding: auto;
`

const BackButton = styled.button`
  position: sticky;
  top: 40px;
  display: inline-flex;
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

const Toc = styled.nav`
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 40px;
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

const SectionTitle = styled.h2`
  color: ${C.text};
  font-size: 1.1rem;
  font-weight: ${fontWeight.semibold};
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
`

const ExplanationText = styled.p`
  color: ${C.textSub};
  font-size: 1rem;
  line-height: 1.6;

  b {
    font-weight: ${fontWeight.bold};
  }
`

const PlaceholderText = styled.p`
  color: ${C.textSub};
  font-size: 1rem;
  line-height: 1.8;
  text-align: center;
  padding: 48px 0;
  border: 1px dashed rgba(99, 102, 241, 0.2);
  border-radius: 12px;
`

type TocId = 'atoms' | 'electrons' | 'wave' | 'experiment' | 'research'

export const Physics = () => {
  const navigate = useNavigate()
  const atomsRef = useRef<HTMLElement>(null)
  const electronsRef = useRef<HTMLElement>(null)
  const waveRef = useRef<HTMLElement>(null)
  const experimentRef = useRef<HTMLElement>(null)
  const researchRef = useRef<HTMLElement>(null)
  const [activeId, setActiveId] = useState<TocId>('atoms')

  useEffect(() => {
    const refMap: Record<TocId, React.RefObject<HTMLElement | null>> = {
      atoms: atomsRef,
      electrons: electronsRef,
      wave: waveRef,
      experiment: experimentRef,
      research: researchRef
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id as TocId)
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )
    for (const ref of Object.values(refMap)) {
      if (ref.current) observer.observe(ref.current)
    }
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: TocId) => {
    const refMap: Record<TocId, React.RefObject<HTMLElement | null>> = {
      atoms: atomsRef,
      electrons: electronsRef,
      wave: waveRef,
      experiment: experimentRef,
      research: researchRef
    }
    refMap[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <PageWrapper>
      <Layout>
        <SideMenu>
          <BackButtonWrapper>
            <BackButton onClick={() => navigate('/')}>← 戻る</BackButton>
          </BackButtonWrapper>
          <Toc>
            <TocTitle>目次</TocTitle>
            <TocItem $active={activeId === 'atoms'} onClick={() => scrollTo('atoms')}>
              原子と電子
            </TocItem>
            <TocItem $active={activeId === 'electrons'} onClick={() => scrollTo('electrons')}>
              物質の中の電子
            </TocItem>
            <TocItem $active={activeId === 'wave'} onClick={() => scrollTo('wave')}>
              波動関数と電子密度
            </TocItem>
            <TocItem $active={activeId === 'experiment'} onClick={() => scrollTo('experiment')}>
              実験で分かること
            </TocItem>
            <TocItem $active={activeId === 'research'} onClick={() => scrollTo('research')}>
              本研究室の成果
            </TocItem>
          </Toc>
        </SideMenu>
        <Content>
          <PageTitle>物理的な背景</PageTitle>

          <Section id="atoms" ref={atomsRef}>
            <SectionTitle>原子と電子</SectionTitle>
            <ExplanationText>
              物質の構成要素として知られる「原子」は、原子核とその周りを回る電子によって構成されます。
              それぞれの原子に含まれる電子の数は元素周期表の番号と一致します。
            </ExplanationText>
            <PeriodicTable />
            <ExplanationText>
              空間中に原子が1つ置かれた場合、電子は空間的に広がりを持ったような状態を取ります。
              この広がりを持ったような電子の状態のことを<b>波動関数</b>と呼びます。
              広がりが球状になっている状態のことをs軌道、ある軸にそって波動関数にプラスの部分とマイナスの部分がある状態のことをp軌道、もう一段階複雑にしたものをd軌道と呼びます。
              p軌道やd軌道は何種類か存在しますが、原子の周囲に何もない場合は全状態を等確率で取りえます。
            </ExplanationText>
          </Section>
          <Section id="electrons" ref={electronsRef}>
            <SectionTitle>物質の中の電子</SectionTitle>
            <ExplanationText>
              一方で、物質の中の電子では周囲の原子や電子との相互作用によって状況が変化します。
            </ExplanationText>
          </Section>

          <Section id="wave" ref={waveRef}>
            <SectionTitle>波動関数と電子密度</SectionTitle>
            <PlaceholderText>ここに説明が入ります</PlaceholderText>
          </Section>

          <Section id="experiment" ref={experimentRef}>
            <SectionTitle>実験で分かること</SectionTitle>
            <PlaceholderText>ここに説明が入ります</PlaceholderText>
          </Section>

          <Section id="research" ref={researchRef}>
            <SectionTitle>本研究室の成果</SectionTitle>
            <PlaceholderText>ここに説明が入ります</PlaceholderText>
          </Section>
        </Content>
      </Layout>
    </PageWrapper>
  )
}
