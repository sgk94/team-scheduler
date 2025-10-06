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
import UpsertSchedulePage from "./pages/UpsertSchedulePage";
import ManageSchedulePage from "./pages/ManageSchedulePage";

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
            path="schedule"
            element={
              <PrivateRoute>
                <ManageSchedulePage />
              </PrivateRoute>
            }
          />

          <Route
            path="schedule/create"
            element={
              <PrivateRoute>
                <UpsertSchedulePage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
