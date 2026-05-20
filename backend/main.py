from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import (
    Level,
    StartGameRequest,
    StartGameResponse,
    AnswerRequest,
    AnswerResponse,
    CorrectAnswerResponse,
    RankingResponse,
    AddUserToRankingRequest,
    BasisWaveFunctionRequest,
    BasisProductRequest,
    WaveFunctionProperty,
)
from game_state import get_session
from wave_functions import (
    get_raw_wavefunction,
    apply_coefficients,
    compute_electron_density,
    compute_inner_product,
    normalize_density,
)
import numpy as np
from scoring import compute_score
from ranking import load_ranking, add_to_ranking, is_in_ranking

app = FastAPI(title="VED Reconstruction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/start-game", response_model=StartGameResponse)
def start_game(request: StartGameRequest):
    session = get_session()
    result = session.start_game(request.level)
    return StartGameResponse(
        start_time=result["start_time"],
        limit_seconds=result["limit_seconds"],
        max_answer_num=result["max_answer_num"],
        wave_function_property_list=result["wave_function_property_list"],
        target_electron_density=result["target_electron_density"],
    )


@app.post("/basis-wave-function")
def get_basis_wave_function(request: BasisWaveFunctionRequest):
    props = request.wave_func_props
    try:
        psi = get_raw_wavefunction(props.ell, props.m)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    result = apply_coefficients(psi, props.amplitude, props.phase)
    return {"wave_function": result.real.tolist()}


@app.post("/basis-product")
def get_basis_product(request: BasisProductRequest):
    try:
        psi1 = get_raw_wavefunction(request.wave_func1.ell, request.wave_func1.m)
        psi2 = get_raw_wavefunction(request.wave_func2.ell, request.wave_func2.m)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    combined1 = apply_coefficients(psi1, request.wave_func1.amplitude, request.wave_func1.phase)
    combined2 = apply_coefficients(psi2, request.wave_func2.amplitude, request.wave_func2.phase)
    density = np.abs(combined1 + combined2) ** 2

    return {"electron_density": density.tolist()}


@app.get("/ranking/{level}", response_model=RankingResponse)
def get_ranking(level: Level):
    ranking = load_ranking(level)
    return RankingResponse(ranking_user_list=ranking[:5])


@app.post("/answer", response_model=AnswerResponse)
def submit_answer(request: AnswerRequest):
    session = get_session()
    if session.level is None:
        raise HTTPException(status_code=400, detail="No active game session")

    session.answer_count += 1
    if session.answer_count > session.max_answer_num + 1:
        raise HTTPException(status_code=400, detail="Max answers exceeded")

    wave_func_list = []
    amplitudes = []
    phases = []
    for props in request.wave_func_props_list:
        psi = get_raw_wavefunction(props.ell, props.m)
        wave_func_list.append((psi, props.amplitude, props.phase))
        amplitudes.append(props.amplitude)
        phases.append(props.phase)

    answer_density = compute_electron_density(wave_func_list)

    inner_product = compute_inner_product(session.target_density, answer_density)

    start_dt = datetime.fromisoformat(session.start_time)
    now = datetime.now(timezone.utc)
    elapsed = (now - start_dt).total_seconds()
    remaining = max(0.0, session.limit_seconds - elapsed)

    is_time_up_answer = elapsed > session.limit_seconds
    if is_time_up_answer:
        remaining = 0.0

    score = compute_score(inner_product, remaining, session.level)

    if score > session.highest_score:
        session.highest_score = score
        session.best_density = answer_density

    in_ranking = is_in_ranking(session.level, session.highest_score)

    is_correct = session.check_correct(amplitudes, phases)

    return AnswerResponse(
        now_electron_density=answer_density.tolist(),
        now_score=score,
        now_highest_score=session.highest_score,
        in_ranking=in_ranking,
        answer_num=session.answer_count,
        is_correct=is_correct,
        elapsed_seconds=round(elapsed, 1),
    )


@app.get("/correct-answer", response_model=CorrectAnswerResponse)
def get_correct_answer():
    session = get_session()
    if session.level is None:
        raise HTTPException(status_code=400, detail="No active game session")

    correct_props = []
    for i, wf in enumerate(session.wave_function_properties):
        correct_wf = WaveFunctionProperty(
            ell=wf.ell,
            m=wf.m,
            phase=session.target_phases[i],
            possible_phase_list=wf.possible_phase_list,
            amplitude=session.target_amplitudes[i],
            amplitude_min=wf.amplitude_min,
            amplitude_max=wf.amplitude_max,
            possible_amplitude_list=wf.possible_amplitude_list,
            wave_function=wf.wave_function,
        )
        correct_props.append(correct_wf)

    return CorrectAnswerResponse(wave_function_property_list=correct_props)


@app.post("/ranking/{level}", response_model=RankingResponse)
def add_user_to_ranking(level: Level, request: AddUserToRankingRequest):
    session = get_session()

    if len(request.username) > 10:
        raise HTTPException(status_code=400, detail="Username too long (max 10 chars)")

    if not request.username:
        raise HTTPException(status_code=400, detail="Username is required")

    if not is_in_ranking(level, session.highest_score):
        raise HTTPException(status_code=400, detail="Score does not qualify for ranking")

    ranking = add_to_ranking(level, request.username, session.highest_score)
    return RankingResponse(ranking_user_list=ranking[:5])
