import { Routes, Route } from "react-router-dom";
import { Start } from "./pages/Start";
import { LevelSelect } from "./pages/LevelSelect";
import { Playing } from "./pages/Playing";
import { Result } from "./pages/Result";
import { RankingBoard } from "./pages/RankingBoard";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/level-select" element={<LevelSelect />} />
      <Route path="/playing" element={<Playing />} />
      <Route path="/result" element={<Result />} />
      <Route path="/ranking" element={<RankingBoard />} />
    </Routes>
  );
};
