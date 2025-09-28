import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PrivateRoute from "./routes/PrivateRoute";
import AppLayout from "./components/AppLayout";
import VacationPage from "./pages/VacationPage";
import MembersPage from "./pages/MembersPage";
import UpsertRotationsPage from "./pages/UpsertRotationsPage";
import RotationsPage from "./pages/RotationsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route element={<AppLayout />}>
          <Route
            path="dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="vacation"
            element={
              <PrivateRoute>
                <VacationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="members"
            element={
              <PrivateRoute>
                <MembersPage />
              </PrivateRoute>
            }
          />

          <Route
            path="rotations"
            element={
              <PrivateRoute>
                <RotationsPage />
              </PrivateRoute>
            }
          />

          <Route
            path="rotations/create"
            element={
              <PrivateRoute>
                <UpsertRotationsPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
