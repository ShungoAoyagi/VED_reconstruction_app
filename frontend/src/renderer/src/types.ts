export type Level = "easy" | "normal" | "hard";

export type WaveFuncProps = {
  ell: number;
  m: number;
  phase: number;
  amplitude: number;
};

export type WaveFunctionProperty = {
  ell: number;
  m: number;
  phase: number;
  possible_phase_list: number[];
  amplitude: number;
  amplitude_min: number;
  amplitude_max: number;
  possible_amplitude_list: number[];
  wave_function: number[];
};

export type RankingUser = {
  rank: number;
  username: string;
  score: number;
};

export type StartGameResponse = {
  start_time: string;
  limit_seconds: number;
  max_answer_num: number;
  wave_function_property_list: WaveFunctionProperty[];
  target_electron_density: number[];
};

export type AnswerResponse = {
  now_electron_density: number[];
  now_score: number;
  now_highest_score: number;
  in_ranking: boolean;
  answer_num: number;
};

export type CorrectAnswerResponse = {
  wave_function_property_list: WaveFunctionProperty[];
};

export type RankingResponse = {
  ranking_user_list: RankingUser[];
};
