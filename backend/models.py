from enum import Enum
from pydantic import BaseModel


class Level(str, Enum):
    EASY = "easy"
    NORMAL = "normal"
    HARD = "hard"


class WaveFuncProps(BaseModel):
    ell: int
    m: int
    phase: float
    amplitude: float


class WaveFunctionProperty(BaseModel):
    ell: int
    m: int
    phase: float
    possible_phase_list: list[float]
    amplitude: float
    amplitude_min: int
    amplitude_max: int
    possible_amplitude_list: list[float]
    wave_function: list[float]

    class Config:
        populate_by_name = True


class RankingUser(BaseModel):
    rank: int
    username: str
    score: int


class StartGameRequest(BaseModel):
    level: Level


class StartGameResponse(BaseModel):
    start_time: str
    limit_seconds: int
    max_answer_num: int
    wave_function_property_list: list[WaveFunctionProperty]
    target_electron_density: list[float]


class AnswerRequest(BaseModel):
    wave_func_props_list: list[WaveFuncProps]


class AnswerResponse(BaseModel):
    now_electron_density: list[float]
    now_score: int
    now_highest_score: int
    in_ranking: bool
    answer_num: int
    is_correct: bool
    elapsed_seconds: float


class CorrectAnswerResponse(BaseModel):
    wave_function_property_list: list[WaveFunctionProperty]


class RankingResponse(BaseModel):
    ranking_user_list: list[RankingUser]


class AddUserToRankingRequest(BaseModel):
    username: str


class BasisWaveFunctionRequest(BaseModel):
    wave_func_props: WaveFuncProps


class BasisProductRequest(BaseModel):
    wave_func1: WaveFuncProps
    wave_func2: WaveFuncProps
