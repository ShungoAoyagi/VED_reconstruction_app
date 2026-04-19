import type {
  Level,
  WaveFuncProps,
  StartGameResponse,
  AnswerResponse,
  CorrectAnswerResponse,
  RankingResponse,
} from "../types";

const DEFAULT_PORT = 8000;

let apiPort = DEFAULT_PORT;

export const setApiPort = (port: number) => {
  apiPort = port;
};

export const getBaseUrl = () => `http://localhost:${apiPort}`;

const apiFetch = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};

export const api = {
  healthCheck: () => apiFetch<{ status: string }>("/health"),

  startGame: (level: Level) =>
    apiFetch<StartGameResponse>("/start-game", {
      method: "POST",
      body: JSON.stringify({ level }),
    }),

  getBasisWaveFunction: (waveFuncProps: WaveFuncProps) =>
    apiFetch<{ wave_function: number[] }>("/basis-wave-function", {
      method: "POST",
      body: JSON.stringify({ wave_func_props: waveFuncProps }),
    }),

  getBasisProduct: (waveFunc1: WaveFuncProps, waveFunc2: WaveFuncProps) =>
    apiFetch<{ electron_density: number[] }>("/basis-product", {
      method: "POST",
      body: JSON.stringify({ wave_func1: waveFunc1, wave_func2: waveFunc2 }),
    }),

  submitAnswer: (waveFuncPropsList: WaveFuncProps[]) =>
    apiFetch<AnswerResponse>("/answer", {
      method: "POST",
      body: JSON.stringify({ wave_func_props_list: waveFuncPropsList }),
    }),

  getCorrectAnswer: () =>
    apiFetch<CorrectAnswerResponse>("/correct-answer"),

  getRanking: (level: Level) =>
    apiFetch<RankingResponse>(`/ranking/${level}`),

  addUserToRanking: (level: Level, username: string) =>
    apiFetch<RankingResponse>(`/ranking/${level}`, {
      method: "POST",
      body: JSON.stringify({ username }),
    }),
};
