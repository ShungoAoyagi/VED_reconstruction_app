import { SectionTitle, ExplanationText } from '../styles'

export const ExperimentSection = (): React.ReactElement => (
  <>
    <SectionTitle>実際の実験で分かること</SectionTitle>
    <ExplanationText>
      電子の広がりのスケールは、おおよそ10の-10乗程度のスケール、身近なものでたとえると、人間が地球ぐらいの大きさだったとすると砂粒ぐらいの大きさです。
      この極めて微小なものを観測する手法として、本研究室ではX線を用いています。
    </ExplanationText>
    <ExplanationText>
      X線で小さなものを見る、というと病院で使われるような装置を思いつくかもしれませんが、実際には全く異なる原理で測定を行っています。
      具体的には、物質中の構造の周期性を利用して、大きな結晶であっても1つ分の周期は短いことから、必要な情報は限定的であることを利用しています。
    </ExplanationText>
    <ExplanationText>
      このような精密測定を行うためには、強く、エネルギーの大きなX線が必要です。そこで本研究室では、兵庫県にある大型放射光施設SPring-8で実験を行っています。
      SPring-8での実験によって、10の-11乗メートル程度の構造を見ることができています。
    </ExplanationText>
  </>
)
