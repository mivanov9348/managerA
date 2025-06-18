import useUserGameStore from "../store/UserGameStore";

export const resetGame = (navigate) => {
  const confirmReset = window.confirm("Are you want to reset the game?");
  if (!confirmReset) return;

  localStorage.clear();
  useUserGameStore.getState().resetStore();
  navigate("/");
};
