import { SectionTitle, ExplanationText } from '../styles'

export const ResearchSection = (): React.ReactElement => (
  <>
    <SectionTitle>本研究室の成果</SectionTitle>
    <ExplanationText>
      本研究室では、実験的に観測した電子密度のデータから、電子の波動関数を復元する手法の開発を行っています。
      実際に、いくつかの物質系において電子がどのような波動関数から構成されているかを明らかにし、系統的な比較を行うことに成功しました。
      電子の波動関数が復元できると、物質が示す多彩な応答を予言でき、応答の起源を解明できる可能性があります。
    </ExplanationText>
    <ExplanationText>
      一方で、現在の観測精度には限界があり、波動関数全体を復元できるわけではありません。
      完全な情報を得るためにはさらなる観測精度の向上と、手法の改善が求められています。
      本展示では、その前段階となる現時点で用いている手法に基づいたゲームを体験することができます。
    </ExplanationText>
  </>
)
