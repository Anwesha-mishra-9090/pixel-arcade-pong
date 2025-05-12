
import React from "react";

type ScoreboardProps = {
  player1Score: number;
  player2Score: number;
};

const Scoreboard = ({ player1Score, player2Score }: ScoreboardProps) => {
  return (
    <div className="flex justify-center items-center w-full space-x-12">
      <div className="flex flex-col items-center">
        <span className="text-neon-pink text-lg font-semibold">PLAYER 1</span>
        <span className="text-6xl font-bold neon-text-pink">{player1Score}</span>
      </div>
      
      <div className="text-white text-4xl font-bold">VS</div>
      
      <div className="flex flex-col items-center">
        <span className="text-neon-blue text-lg font-semibold">PLAYER 2</span>
        <span className="text-6xl font-bold neon-text-blue">{player2Score}</span>
      </div>
    </div>
  );
};

export default Scoreboard;
