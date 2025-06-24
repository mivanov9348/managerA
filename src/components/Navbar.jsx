import { NavLink, useNavigate } from "react-router-dom";
import useUserGameStore from "../store/UserGameStore";
import { resetGame } from "../utils/resetGame";

const Navbar = () => {
  const currentTeam = useUserGameStore((state) => state.currentTeam);
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-5 py-3 bg-neutral-900 text-white">
      <div className="flex gap-4 items-center">
        <NavLink to="/" className="text-white hover:underline">
          Home
        </NavLink>
        <NavLink to="/standings" className="text-white hover:underline">
          Standings
        </NavLink>
        <NavLink to="/fixtures" className="text-white hover:underline">
          Fixtures
        </NavLink>
        <NavLink to="/next-match" className="text-white hover:underline">
          Next Match
        </NavLink>
        <NavLink to="/squads" className="text-white hover:underline">
          Squads
        </NavLink>
        <NavLink to="/stats" className="text-white hover:underline">
          Stats
        </NavLink>
        <NavLink to="/transfers" className="text-white hover:underline">
          Transfers
        </NavLink>
      </div>

      {currentTeam && (
        <div className="flex items-center font-bold text-base">
          <span className="text-teal-400">⚽ {currentTeam}</span>
          <button
            onClick={() => resetGame(navigate)}
            className="ml-4 px-3 py-1.5 bg-red-500 text-white rounded-md font-bold hover:bg-red-700 transition cursor-pointer active:scale-95"
          >
            Reset
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
