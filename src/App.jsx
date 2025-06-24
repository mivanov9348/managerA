import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  const currentTeam = useUserGameStore((state) => state.currentTeam);

  return (
    <Router>
      {currentTeam && <Navbar />}
      <TeamSelectModal />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/standings" element={<StandingsTable />} />
          <Route path="/fixtures" element={<Fixtures />} />
          <Route path="/next-match" element={<NextMatch />} />
          <Route path="/squads" element={<Squads />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/transfers" element={<Transfers />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
