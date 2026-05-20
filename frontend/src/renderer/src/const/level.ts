import type { Level } from '../types'
import { colors } from '../design_token'

export const levelDescriptions: Record<Level, string> = {
  easy: '大きさを解答\n制限時間: 2分\n4回まで解答可能',
  normal: '大きさと角度を選択\n制限時間: 3分\n5回まで解答可能',
  hard: '大きさと角度を入力\n制限時間: 3分\n5回まで解答可能'
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
