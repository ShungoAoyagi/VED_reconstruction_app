import { PeriodicTable } from '../../../components/PeriodicTable'
import { SectionTitle, ExplanationText } from '../styles'

export const AtomsSection = (): React.ReactElement => (
  <>
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
  </>
)
