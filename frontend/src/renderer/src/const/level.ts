import type { Level } from '../types'
import { colors } from '../design_token'

export const levelRoughDescriptions: Record<Level, string> = {
  easy: '大きさだけ当てよう',
  normal: '大きさと角度が4択で選べる',
  hard: '激辛！その分点数は高い'
}

export const levelDescriptions: Record<Level, string> = {
  easy: '制限時間: 2分\n4回まで答えられるよ',
  normal: '制限時間: 3分\n5回まで答えられるよ',
  hard: '制限時間: 3分\n5回まで答えられるよ'
}

export const levelLabels: Record<Level, string> = {
  easy: 'かんたん',
  normal: 'ふつう',
  hard: 'むずかしい'
}

export const levelColors: Record<Level, string> = {
  easy: colors.level.easy,
  normal: colors.level.normal,
  hard: colors.level.hard
}
