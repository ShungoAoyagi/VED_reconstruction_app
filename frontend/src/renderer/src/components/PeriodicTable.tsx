import { useState } from 'react'
import React from 'react'
import styled from 'styled-components'
import { fontWeight } from '../design_token'

type Category =
  | 'hydrogen'
  | 'alkali'
  | 'alkaline-earth'
  | 'transition'
  | 'lanthanide'
  | 'actinide'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble'
  | 'placeholder'

type ElementData = {
  number: number
  symbol: string
  name: string
  row: number
  col: number
  category: Category
}

const C: Record<Category, { bg: string; border: string; text: string }> = {
  hydrogen: { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.35)', text: '#93c5fd' },
  alkali: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.35)', text: '#fca5a5' },
  'alkaline-earth': {
    bg: 'rgba(249,115,22,0.12)',
    border: 'rgba(249,115,22,0.35)',
    text: '#fdba74'
  },
  transition: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.35)', text: '#a5b4fc' },
  lanthanide: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.35)', text: '#d8b4fe' },
  actinide: { bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.35)', text: '#f9a8d4' },
  'post-transition': {
    bg: 'rgba(20,184,166,0.12)',
    border: 'rgba(20,184,166,0.35)',
    text: '#5eead4'
  },
  metalloid: { bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.35)', text: '#fde047' },
  nonmetal: { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.35)', text: '#86efac' },
  halogen: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.35)', text: '#6ee7b7' },
  noble: { bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)', text: '#fcd34d' },
  placeholder: { bg: 'rgba(99,102,241,0.04)', border: 'rgba(99,102,241,0.18)', text: '#6B7280' }
}

const ELEMENTS: ElementData[] = [
  // Period 1
  { number: 1, symbol: 'H', name: '水素', row: 1, col: 1, category: 'hydrogen' },
  { number: 2, symbol: 'He', name: 'ヘリウム', row: 1, col: 18, category: 'noble' },
  // Period 2
  { number: 3, symbol: 'Li', name: 'リチウム', row: 2, col: 1, category: 'alkali' },
  { number: 4, symbol: 'Be', name: 'ベリリウム', row: 2, col: 2, category: 'alkaline-earth' },
  { number: 5, symbol: 'B', name: 'ホウ素', row: 2, col: 13, category: 'metalloid' },
  { number: 6, symbol: 'C', name: '炭素', row: 2, col: 14, category: 'nonmetal' },
  { number: 7, symbol: 'N', name: '窒素', row: 2, col: 15, category: 'nonmetal' },
  { number: 8, symbol: 'O', name: '酸素', row: 2, col: 16, category: 'nonmetal' },
  { number: 9, symbol: 'F', name: 'フッ素', row: 2, col: 17, category: 'halogen' },
  { number: 10, symbol: 'Ne', name: 'ネオン', row: 2, col: 18, category: 'noble' },
  // Period 3
  { number: 11, symbol: 'Na', name: 'ナトリウム', row: 3, col: 1, category: 'alkali' },
  { number: 12, symbol: 'Mg', name: 'マグネシウム', row: 3, col: 2, category: 'alkaline-earth' },
  { number: 13, symbol: 'Al', name: 'アルミニウム', row: 3, col: 13, category: 'post-transition' },
  { number: 14, symbol: 'Si', name: 'ケイ素', row: 3, col: 14, category: 'metalloid' },
  { number: 15, symbol: 'P', name: 'リン', row: 3, col: 15, category: 'nonmetal' },
  { number: 16, symbol: 'S', name: '硫黄', row: 3, col: 16, category: 'nonmetal' },
  { number: 17, symbol: 'Cl', name: '塩素', row: 3, col: 17, category: 'halogen' },
  { number: 18, symbol: 'Ar', name: 'アルゴン', row: 3, col: 18, category: 'noble' },
  // Period 4
  { number: 19, symbol: 'K', name: 'カリウム', row: 4, col: 1, category: 'alkali' },
  { number: 20, symbol: 'Ca', name: 'カルシウム', row: 4, col: 2, category: 'alkaline-earth' },
  { number: 21, symbol: 'Sc', name: 'スカンジウム', row: 4, col: 3, category: 'transition' },
  { number: 22, symbol: 'Ti', name: 'チタン', row: 4, col: 4, category: 'transition' },
  { number: 23, symbol: 'V', name: 'バナジウム', row: 4, col: 5, category: 'transition' },
  { number: 24, symbol: 'Cr', name: 'クロム', row: 4, col: 6, category: 'transition' },
  { number: 25, symbol: 'Mn', name: 'マンガン', row: 4, col: 7, category: 'transition' },
  { number: 26, symbol: 'Fe', name: '鉄', row: 4, col: 8, category: 'transition' },
  { number: 27, symbol: 'Co', name: 'コバルト', row: 4, col: 9, category: 'transition' },
  { number: 28, symbol: 'Ni', name: 'ニッケル', row: 4, col: 10, category: 'transition' },
  { number: 29, symbol: 'Cu', name: '銅', row: 4, col: 11, category: 'transition' },
  { number: 30, symbol: 'Zn', name: '亜鉛', row: 4, col: 12, category: 'transition' },
  { number: 31, symbol: 'Ga', name: 'ガリウム', row: 4, col: 13, category: 'post-transition' },
  { number: 32, symbol: 'Ge', name: 'ゲルマニウム', row: 4, col: 14, category: 'metalloid' },
  { number: 33, symbol: 'As', name: 'ヒ素', row: 4, col: 15, category: 'metalloid' },
  { number: 34, symbol: 'Se', name: 'セレン', row: 4, col: 16, category: 'nonmetal' },
  { number: 35, symbol: 'Br', name: '臭素', row: 4, col: 17, category: 'halogen' },
  { number: 36, symbol: 'Kr', name: 'クリプトン', row: 4, col: 18, category: 'noble' },
  // Period 5
  { number: 37, symbol: 'Rb', name: 'ルビジウム', row: 5, col: 1, category: 'alkali' },
  { number: 38, symbol: 'Sr', name: 'ストロンチウム', row: 5, col: 2, category: 'alkaline-earth' },
  { number: 39, symbol: 'Y', name: 'イットリウム', row: 5, col: 3, category: 'transition' },
  { number: 40, symbol: 'Zr', name: 'ジルコニウム', row: 5, col: 4, category: 'transition' },
  { number: 41, symbol: 'Nb', name: 'ニオブ', row: 5, col: 5, category: 'transition' },
  { number: 42, symbol: 'Mo', name: 'モリブデン', row: 5, col: 6, category: 'transition' },
  { number: 43, symbol: 'Tc', name: 'テクネチウム', row: 5, col: 7, category: 'transition' },
  { number: 44, symbol: 'Ru', name: 'ルテニウム', row: 5, col: 8, category: 'transition' },
  { number: 45, symbol: 'Rh', name: 'ロジウム', row: 5, col: 9, category: 'transition' },
  { number: 46, symbol: 'Pd', name: 'パラジウム', row: 5, col: 10, category: 'transition' },
  { number: 47, symbol: 'Ag', name: '銀', row: 5, col: 11, category: 'transition' },
  { number: 48, symbol: 'Cd', name: 'カドミウム', row: 5, col: 12, category: 'transition' },
  { number: 49, symbol: 'In', name: 'インジウム', row: 5, col: 13, category: 'post-transition' },
  { number: 50, symbol: 'Sn', name: 'スズ', row: 5, col: 14, category: 'post-transition' },
  { number: 51, symbol: 'Sb', name: 'アンチモン', row: 5, col: 15, category: 'metalloid' },
  { number: 52, symbol: 'Te', name: 'テルル', row: 5, col: 16, category: 'metalloid' },
  { number: 53, symbol: 'I', name: 'ヨウ素', row: 5, col: 17, category: 'halogen' },
  { number: 54, symbol: 'Xe', name: 'キセノン', row: 5, col: 18, category: 'noble' },
  // Period 6
  { number: 55, symbol: 'Cs', name: 'セシウム', row: 6, col: 1, category: 'alkali' },
  { number: 56, symbol: 'Ba', name: 'バリウム', row: 6, col: 2, category: 'alkaline-earth' },
  { number: 0, symbol: '*', name: 'ランタノイド', row: 6, col: 3, category: 'placeholder' },
  { number: 72, symbol: 'Hf', name: 'ハフニウム', row: 6, col: 4, category: 'transition' },
  { number: 73, symbol: 'Ta', name: 'タンタル', row: 6, col: 5, category: 'transition' },
  { number: 74, symbol: 'W', name: 'タングステン', row: 6, col: 6, category: 'transition' },
  { number: 75, symbol: 'Re', name: 'レニウム', row: 6, col: 7, category: 'transition' },
  { number: 76, symbol: 'Os', name: 'オスミウム', row: 6, col: 8, category: 'transition' },
  { number: 77, symbol: 'Ir', name: 'イリジウム', row: 6, col: 9, category: 'transition' },
  { number: 78, symbol: 'Pt', name: '白金', row: 6, col: 10, category: 'transition' },
  { number: 79, symbol: 'Au', name: '金', row: 6, col: 11, category: 'transition' },
  { number: 80, symbol: 'Hg', name: '水銀', row: 6, col: 12, category: 'transition' },
  { number: 81, symbol: 'Tl', name: 'タリウム', row: 6, col: 13, category: 'post-transition' },
  { number: 82, symbol: 'Pb', name: '鉛', row: 6, col: 14, category: 'post-transition' },
  { number: 83, symbol: 'Bi', name: 'ビスマス', row: 6, col: 15, category: 'post-transition' },
  { number: 84, symbol: 'Po', name: 'ポロニウム', row: 6, col: 16, category: 'post-transition' },
  { number: 85, symbol: 'At', name: 'アスタチン', row: 6, col: 17, category: 'halogen' },
  { number: 86, symbol: 'Rn', name: 'ラドン', row: 6, col: 18, category: 'noble' },
  // Lanthanides (row 9, cols 3–17)
  { number: 57, symbol: 'La', name: 'ランタン', row: 8, col: 3, category: 'lanthanide' },
  { number: 58, symbol: 'Ce', name: 'セリウム', row: 8, col: 4, category: 'lanthanide' },
  { number: 59, symbol: 'Pr', name: 'プラセオジム', row: 8, col: 5, category: 'lanthanide' },
  { number: 60, symbol: 'Nd', name: 'ネオジム', row: 8, col: 6, category: 'lanthanide' },
  { number: 61, symbol: 'Pm', name: 'プロメチウム', row: 8, col: 7, category: 'lanthanide' },
  { number: 62, symbol: 'Sm', name: 'サマリウム', row: 8, col: 8, category: 'lanthanide' },
  { number: 63, symbol: 'Eu', name: 'ユウロピウム', row: 8, col: 9, category: 'lanthanide' },
  { number: 64, symbol: 'Gd', name: 'ガドリニウム', row: 8, col: 10, category: 'lanthanide' },
  { number: 65, symbol: 'Tb', name: 'テルビウム', row: 8, col: 11, category: 'lanthanide' },
  { number: 66, symbol: 'Dy', name: 'ジスプロシウム', row: 8, col: 12, category: 'lanthanide' },
  { number: 67, symbol: 'Ho', name: 'ホルミウム', row: 8, col: 13, category: 'lanthanide' },
  { number: 68, symbol: 'Er', name: 'エルビウム', row: 8, col: 14, category: 'lanthanide' },
  { number: 69, symbol: 'Tm', name: 'ツリウム', row: 8, col: 15, category: 'lanthanide' },
  { number: 70, symbol: 'Yb', name: 'イッテルビウム', row: 8, col: 16, category: 'lanthanide' },
  { number: 71, symbol: 'Lu', name: 'ルテチウム', row: 8, col: 17, category: 'lanthanide' }
]

const Wrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(18, minmax(0, 1fr));
  grid-template-rows: repeat(6, 48px) 12px repeat(1, 48px);
  gap: 2px;
  min-width: 700px;
`

const Cell = styled.div<{ $row: number; $col: number; $category: Category }>`
  grid-column: ${({ $col }) => $col};
  grid-row: ${({ $row }) => $row};
  background: ${({ $category }) => C[$category].bg};
  border: 1px solid ${({ $category }) => C[$category].border};
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  transition: filter 0.1s ease;
  cursor: ${({ $category }) => ($category === 'placeholder' ? 'default' : 'pointer')};

  &:hover {
    filter: ${({ $category }) => ($category !== 'placeholder' ? 'brightness(1.6)' : 'none')};
  }
`

const AtomicNumber = styled.span`
  font-size: 0.7rem;
  color: #6b7280;
  line-height: 1;
  align-self: flex-end;
  padding-right: 3px;
`

const Symbol = styled.span<{ $category: Category }>`
  font-size: 0.9rem;
  font-weight: ${fontWeight.bold};
  color: ${({ $category }) => C[$category].text};
  line-height: 1;
`

const TooltipWrapper = styled.div<{ $above: boolean }>`
  position: fixed;
  background: #1c2333;
  border: 1px solid rgba(99, 102, 241, 0.5);
  border-radius: 8px;
  padding: 8px 12px;
  pointer-events: none;
  z-index: 1000;
  transform: ${({ $above }) =>
    $above ? 'translate(-50%, calc(-100% - 8px))' : 'translate(-50%, 8px)'};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  white-space: nowrap;
`

const TooltipSymbol = styled.div`
  font-size: 1rem;
  font-weight: ${fontWeight.bold};
  color: #e6edf3;
`

const TooltipName = styled.div`
  font-size: 0.78rem;
  color: #8b949e;
  margin-top: 2px;
`

const TooltipElectrons = styled.div`
  font-size: 0.75rem;
  color: #818cf8;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(99, 102, 241, 0.2);
`

type HoverState = {
  element: ElementData
  x: number
  y: number
  above: boolean
}

export const PeriodicTable = () => {
  const [hovered, setHovered] = useState<HoverState | null>(null)

  const handleEnter = (element: ElementData, e: React.MouseEvent<HTMLDivElement>) => {
    if (element.number === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const above = rect.top > 160
    setHovered({
      element,
      x: rect.left + rect.width / 2,
      y: above ? rect.top : rect.bottom,
      above
    })
  }

  return (
    <Wrapper>
      <Grid>
        {ELEMENTS.map((el) => (
          <Cell
            key={el.number === 0 ? `placeholder-${el.symbol}` : el.number}
            $row={el.row}
            $col={el.col}
            $category={el.category}
            onMouseEnter={(e) => handleEnter(el, e)}
            onMouseLeave={() => setHovered(null)}
          >
            {el.number > 0 && <AtomicNumber>{el.number}</AtomicNumber>}
            <Symbol $category={el.category}>{el.symbol}</Symbol>
          </Cell>
        ))}
      </Grid>

      {hovered && (
        <TooltipWrapper $above={hovered.above} style={{ left: hovered.x, top: hovered.y }}>
          <TooltipSymbol>{hovered.element.symbol}</TooltipSymbol>
          <TooltipName>{hovered.element.name}</TooltipName>
          <TooltipElectrons>電子数: {hovered.element.number} 個</TooltipElectrons>
        </TooltipWrapper>
      )}
    </Wrapper>
  )
}
