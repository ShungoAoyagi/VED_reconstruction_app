import { SectionTitle, ExplanationText } from '../styles'

export const ElectronsSection = (): React.ReactElement => (
  <>
    <SectionTitle>物質の中の電子</SectionTitle>
    <ExplanationText>
      孤立した原子の中では、同じ種類の軌道（たとえばp軌道の3種類）は向きが違うだけで、すべて同じエネルギーを持っています。
      そのため、特定の向きだけが選ばれるということはありません。
    </ExplanationText>
    <ExplanationText>
      一方で、物質の中に原子が置かれると話が変わります。
      周囲の原子が作る電場の影響を受けて、同じ種類の軌道でも向きによってエネルギーが異なる場合が生じます。
      エネルギーの低い軌道には電子が入りやすく、高い軌道には入りにくいため、
      特定の向きの軌道だけに電子が多く集まるような、独特の電子密度の形が生まれます。
    </ExplanationText>
    <ExplanationText>
      「どの軌道に電子がどれくらい入っているか」を実験で明らかにできれば、
      物質の内部構造や原子間の相互作用を理解する手がかりになります。
      それを可能にするのが、このゲームのテーマである<b>電子密度の再構成</b>です。
    </ExplanationText>
  </>
)
