const trackedStats = {
  gamesWon: 0,
  gamesTied: 0,
  gamesLost: 0,
  gamesPlayed: 0,
  recentGames: [
    {
      players: [],
      winner: "",
      loser: "",
    },
  ],
};

const formattedStats = [
  "Games Won",
  "Games Tied",
  "Games Lost",
  "Games Played",
];

function getTrackedStats() {
  const storedStats = localStorage.getItem("trackedStats");
  if (!storedStats) {
    localStorage.setItem("trackedStats", trackedStats);
    return;
  }
}
