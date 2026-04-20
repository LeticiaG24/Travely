import { Routes, Route } from "react-router-dom";
import { HomePage, ViagemPage } from "./pages/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/viagem/:id" element={<ViagemPage />} />
    </Routes>
  );
}