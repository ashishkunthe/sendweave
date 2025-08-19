import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LogIn } from "./pages/LogIn";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Homepage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
