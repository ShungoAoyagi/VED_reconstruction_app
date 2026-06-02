import type { Level } from '../types'
import { colors } from '../design_token'

export const levelRoughDescriptions: Record<Level, string> = {
  easy: '大きさだけ当てよう',
  normal: '大きさと角度が4択で選べる',
  hard: '激辛！その分点数は高いぞ'
}

export const levelDescriptions: Record<Level, string> = {
  easy: '制限時間: 2分半、解答回数: 4回まで',
  normal: '制限時間: 3分、解答回数: 5回まで',
  hard: '制限時間: 3分半、解答回数: 5回まで'
}

export const levelLabels: Record<Level, string> = {
  easy: '普通',
  normal: '難しい',
  hard: '激ムズ'
}

export const levelColors: Record<Level, string> = {
  easy: colors.level.easy,
  normal: colors.level.normal,
  hard: colors.level.hard
}
