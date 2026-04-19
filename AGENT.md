# 概要

目標の電子密度が表示されていて、水素原子の固有状態の波動関数を足し合わせて目標に近づけるゲーム。
足し合わせる波動関数はあらかじめ分かっていて、その係数の大きさや位相を調整することで電子密度を構成し、目標に近い値であればあるほど得点が高くなる。
また、解答にかかった時間も記録され、得点にも関連する。
ローカルのランキング機能が存在し、トップ5に入った場合ランキングに掲載することができる。ランキングに表示する名前も設定可能。

## 機能

- ゲームには複数のレベルが存在し、それぞれについてランキングが存在する。いずれの場合においても、不正解・正解に関わらず、最後の解答を行なった時間を解答完了時間とする。また、正解した時点で必ず終了するが、不正解の場合でもやめることができる。不正解だった場合、最も近い値だった解答を採点に用いる。全てのモードにおいて、1つ目の波動関数のみ係数は2で固定されている。
  - 3つの波動関数が与えられ、位相は固定、係数を1つの波動関数につき3種類の選択肢から選べる「かんたん」モード
    - 3回まで答えることができる。係数は全て自然数。係数の値は1, 2, 4の3択。位相は後述する条件の下でランダムに決定される。制限時間は2分。
  - 3つの波動関数が与えられ、位相は90度刻みで選択可能、係数は1つの波動関数につき3種類の選択肢から選べる「ふつう」モード
    - 5回まで答えることができる。係数は全て自然数。係数の値は1, 2, 4の3択。位相は0°から270°まで90°刻みでランダムに決定される。制限時間は3分。
  - 3つの波動関数が与えられ、位相、係数ともに手動で入力する「むずかしい」モード
    - 5回まで答えることができる。係数は小数を取りうる。係数の値は1以上4以下。位相の原点は固定されている。制限時間は3分。
- 時間切れになったら波動関数の3d表示だけがされていて回転や係数の変化による確認ができない形式の解答の入力画面が表示され、そこで入力して1度まで解答する。この時、解答時間には加算されず、制限時間の値が使用される。
- ここで、「正解」とは、特に「むずかしい」以外のモードにおいて発生するもので、係数の値と位相の値が完全に一致した場合のみを指す。
- チュートリアルのモーダルが存在する。簡単なルール説明のほか、2種類の波動関数の足し合わせる係数の大きさを変化させた時に電子密度がどのように変わるかを実際に試すことができる。チュートリアルのモーダルはスタート画面、レベル選択画面、ゲーム中の画面で開くことができる。ゲーム中の場合もタイマーは停止しない。
- そのほか、スタート画面、レベル選択画面、結果の表示画面、ランキング閲覧画面が存在する。

## 詳細な仕様

- 得点計算
  規格化した目標の電子密度と規格化した解答の電子密度の内積Pと、残った時間t(sec)に、以下のような補正を加えたもの（小数点以下切り上げをした整数）を得点とする。
  d/(1.01-P) \* \sqrt{t + D}
  ここで、dは(1: かんたん、10: ふつう、1000: むずかしい)であり、Dは(1: かんたん、10: ふつう、1000: むずかしい)とする。
  また、得点は整数になるように切り上げる。点数が同じだった場合、先にその得点を記録した方を上の順位とする。
- 与えられる波動関数
  全てp軌道またはd軌道で固定する。現れるセットとしては、
  - セット1: p{m=1}, d{m=1}, d{m=-2}
  - セット2: p{m=1}, p{m=-1}, d{m=1}, d{m=-1}
    の2種類(セット1から3つの軌道が選ばれる、またはセット2から3つの軌道が選ばれる)。どちらも波動関数を表示する際には実部のみを表示する。
- 波動関数や電子密度の仕様
  - x, y, zの順で1次元化する ([0,0,0], [0,0,1], ..., [0,1,0], [0,1,1], ...の順)
  - グリッドサイズは21×21×21で、[10,10,10]が原点になるようにとる。

# 構成の概要

Frontend: Electron (React)
Backend: Python
通信: FastAPI

MacでもWindowsでも動くようなデスクトップアプリケーションの形をとる。
バンドルはプロジェクト全体に対して行い、デバイス側にpython環境が整っていなくても動作するようにする。
ポート番号については8000で固定で、8000が使われている場合8001, 8002と使っていく

# API

私がgraphQLをメインに使ってきたのでgraphQLっぽい形で書きますが、通信はFastAPIを使うのでいい感じに変更してください

```
type WaveFuncProps {
  ell: Int!
  m: Int!
  phase: Float!
  amplitude: Float!
}

type WaveFunctionProperty {
  ell: Int!
  m: Int!
  phase: Float!
  possiblePhaseList: [Float!]! # hardでは空配列
  amplitude: Float!
  amplitudeMin: Int!
  amplitudeMax: Int!
  possibleAmplitudeList: [Float!]! # hardでは空配列
  waveFunction: [Float!]! # 波動関数の実部のみ
}

type RankingUser {
  rank: Int!
  username: String!
  score: Int!
}

enum Level {
  Easy
  Normal
  Hard
}

query getBasisWaveFunctionQuery(waveFuncProps: WaveFuncProps!) {
  waveFunction: [Float!]!
}

query getBasisProductQuery(waveFunc1: WaveFuncProps!, waveFunc2: WaveFuncProps!) {
  electronDensity: [Float!]! # 実部のみを返す
}

query getRankingQuery() {
  rankingUserList: [RankingUser!]!
}

query getNowAnswerScoreQuery(waveFuncPropsList: [WaveFuncPropsList!]!) {
  nowElectronDensity: [Float!]!
  nowScore: Int!
  nowHighestScore: Int!
  inRanking: Boolean!
  answerNum: Int!
}

query getCorrectAnswerQuery() {
  waveFunctionPropertyList: [WaveFunctionProperty!]!
}

mutation startGame(level: Level!) {
  startTime: Time!
  limitSeconds: Int! # 制限時間(秒)
  maxAnswerNum: Int! # 最大解答回数
  waveFunctionPropertyList: [waveFunctionProperty!]!
  targetElectronDensity: [Float!]!
}

mutation addUserToRanking(username: String!) {
  rankingUserList: [RankingUser!]!
}
```

## 各種APIの仕様

### getBasisWaveFunctionQuery

波動関数の情報を入力したら、係数や位相をかけて実部のみを返すquery

### getBasisProductQuery

2つの波動関数の情報を入力したら、その2つの波動関数の和の2乗を返すquery

### getRankingQuery

現在のランキングを返すquery

### getNowAnswerScoreQuery

挑戦中に一時的な解答、もしくは最終的な解答をした際に解答から構成した電子密度とスコアの他、現在の挑戦での最高スコア、ランキング入りしているか、何回目の解答かを返すquery

### getCorrectAnswerQuery

正しい答えを返すquery

### startGame

ゲーム開始時に実行されるmutationで、レベルに対応した波動関数のリストと答えの電子密度を返す。
また、表示するために開始時間や制限時間、最大解答回数も返す。

### addUserToRanking

ランキング入りした場合に更新する用のmutation。FEでもBEでもランキング入りしたかどうかはバリデーションする。usernameの文字数制限はFEでかけ、最大10文字とする(雑にlengthでカウントする)

# Frontend

## 使用技術

- パッケージマネージャー: pnpm
- pnpm, nodeのバージョン管理: volta
- バンドル: vite
- lint: Biome
- ルーティング: React-router
- UIテスト: storybook
- CSS: styled-components
- UIライブラリ: chakra UI
- モーダルの管理: react-modal

## ディレクトリ構成

```
frontend/
├── main/
│   ├── index.ts              # ウィンドウ生成、アプリライフサイクル
│   └── python-manager.ts     # FastAPI起動/停止
│
├── preload/
│   └── index.ts              # メイン↔レンダラーの安全な橋渡し
│
└── renderer/
    ├── index.html
    └── src/
        ├── main.tsx           # エントリーポイント
        ├── pages/             # 画面ごとのコンポーネント
        │   ├── Home.tsx
        │   ├── Settings.tsx
        │   └── Result.tsx
        ├── components/        # 共通UIパーツ
        ├── hooks/
        ├── api/               # FastAPIとの通信クライアント
        │   └── client.ts      # fetch で localhost:8000 を叩く
        ├── design_token.ts
        └── router.tsx         # React Router等でページ遷移を定義
```

## コーディング規約

- linterとしてはBiomeの基本設定を採用する。
- 型及びコンポーネントはUpperCamelCase、一般の変数およびhookはlowerCamelCaseを採用する。
- コンポーネントは全て関数コンポーネントを採用し、アロー関数で宣言する。
- コンポーネントの引数の型はinterfaceではなくtypeで宣言する。
- デザイントークンにある値を用いてfontsize、color、paddingは記述する。
- 基本的に余白を開ける際はpaddingを採用し、marginは使用しない。

## 状態遷移

存在しうる状態遷移は以下

Start -> LevelSelect -> Playing -> Result

- Start -> LevelSelect
  - スタートボタンを押したらレベル選択画面が表示される
  - LevelSelect -> Startに戻ることもボタンをできる
- LevelSelect -> Playing
  - レベルを選ぶとAPIを叩き、BasisSetが正常に返ってきたらそのBasisSetの情報とレベルを情報として持ってPlayingに遷移する
  - Playing画面では、必要な情報(BasisSetおよびPlaying)が揃っていなかった場合LevelSelectに強制的に戻る
- Playing
  - 一時停止は存在せず、中止(戻るボタン、確認モーダルを表示してOKを押したらLevelSelectに戻る)のみがある
  - 時間の処理は開始時間(startTime)から計算する。中断、スリープでもタイマーは動き続ける。
  - 時間切れになった場合、モーダルで解答画面が表示される（上述）

## 共通のUI

全体として丸みを帯びたデザインにする。また、背景の色は白を基調としたものとし、primary colorは青とする。

### PrimaryButton

基本的に使われるボタン。ベースの色は青とし、クリックするために押し込んでいることが分かるようにする。
propsは現状通常のbuttonのpropsのみとするが、将来的な拡張の可能性を考えてPrimaryButtonPropsを引数の型として定義する。

### IconButton

閉じるボタン(×アイコン)、チュートリアルのモーダルを開くボタン(?アイコン)、戻るボタン(←アイコン)のように、アイコンを表示するためのボタン。
propsで表示するアイコンの種類を指定できる形をとる。

### SelectButton

選択式のレベルで選択に用いるボタン。デフォルトでは白抜きで枠線が青色になっており、選択中は全体の色が青、文字色が白に変化する。

### Input

htmlのinputコンポーネントを変更したもの。フォーカスが当たっていない場合は灰色の枠線、当たっているときは青色の枠線とする。
エラーがある場合は赤色にする。エラー文の表示はデザインが崩れないよう、`position: static`以外の形で実装する。

## 代表的なコンポーネント

- 電子密度、波動関数を3次元で表示するコンポーネント
  - 回転させられるが、回転の角度や回転の情報を更新する関数はpropsで渡して複数のコンポーネント間で表示方向が同期できるようにする
  - このコンポーネントに渡される電子密度はpropsで渡される
  - グリッドはグローバルに定義した固定値で固定
  - 表示の閾値は固定する（コンポーネント内では変えられるようにはするが、基本的にデフォルト値で使用する）
  - 表示はThree.jsを用いる
- ランキング表示コンポーネント
  - ランキングが表示される

# Backend

## 基本的な仕様

ローカルで全て動作するタイプのアプリケーションのため、ユーザーの一時的な情報も多くはバックエンドで保持する。
例えば、現在のトライ中の最高スコアや波動関数のリスト、その複素数関数での値などはバックエンドで保持する。また、ランキングの永続化処理（ファイルへの書き込み処理）もバックエンドで行う。
さらに、スリープにも対応するため挑戦開始時刻はファイルに書き込む。
ランキングの保存はレベルごとにアイルを分けたtsv形式で、最新の上位5名のユーザー名とスコアのみ書き込む
ファイルが破損した場合は潔くファイルを削除して作り直す

波動関数のデータは事前計算しておいてファイルに保持する。
事前計算用のスクリプトはscriptディレクトリ中に用意する。
