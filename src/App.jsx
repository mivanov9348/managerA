import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StandingsTable from "./pages/StandingsTable";
import NextMatch from "./pages/NextMatch";
import Fixtures from "./pages/Fixtures";
import TeamSelectModal from "./components/TeamSelectModal";
import useUserGameStore from "./store/UserGameStore";
import Squads from "./pages/Squads";
import Stats from "./pages/Stats";
import Transfers from "./pages/Transfers";
import DraftPage from "./pages/DraftPage";

const ProtectedRoute = ({ element }) => {
  const draftCompleted = useUserGameStore((state) => state.draftCompleted);
  const location = useLocation();

  if (!draftCompleted && location.pathname !== "/draft") {
    return <Navigate to="/draft" replace />;
  }

  return element;
};

function App() {
  const currentTeam = useUserGameStore((state) => state.currentTeam);

  return (
    <Router>
      {currentTeam && <Navbar />}
      <TeamSelectModal />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/standings" element={<ProtectedRoute element={<StandingsTable />} />} />
          <Route path="/fixtures" element={<ProtectedRoute element={<Fixtures />} />} />
          <Route path="/next-match" element={<ProtectedRoute element={<NextMatch />} />} />
          <Route path="/squads" element={<ProtectedRoute element={<Squads />} />} />
          <Route path="/stats" element={<ProtectedRoute element={<Stats />} />} />
          <Route path="/transfers" element={<ProtectedRoute element={<Transfers />} />} />
          <Route path="/draft" element={<DraftPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
