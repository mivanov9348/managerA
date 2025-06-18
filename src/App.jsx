import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import StandingsTable from "./pages/StandingsTable";
import NextMatch from "./pages/NextMatch";
import Squad from "./pages/Squad";
import Fixtures from "./pages/Fixtures";
import TeamSelectModal from "./components/TeamSelectModal";
import Teams from "./pages/Teams";
import useUserGameStore from "./store/UserGameStore";

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
          <Route path="/teams" element={<Teams />} />
          <Route path="/squad" element={<Squad />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
