import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LogIn } from "./pages/LogIn";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Homepage";
import FlowDetails from "./pages/FlowDetails";
import FlowBuilder from "./pages/FlowBuilder";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flows/:id"
          element={
            <ProtectedRoute>
              <FlowDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flows/:id/edit"
          element={
            <ProtectedRoute>
              <FlowBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flow-builder"
          element={
            <ProtectedRoute>
              <FlowBuilder />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<p>404 Page Not Found</p>} />
      </Routes>
    </BrowserRouter>
  );
}
