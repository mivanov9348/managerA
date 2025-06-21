import useUserGameStore from "../store/UserGameStore";

export const resetGame = () => {
  const confirmReset = window.confirm("Are you sure you want to reset the game?");
  if (!confirmReset) return;

  localStorage.clear();

  window.location.reload(true);
};

