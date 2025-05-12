
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Canvas } from "@react-three/fiber";
import PongGame from "@/components/game/PongGame";
import Scoreboard from "@/components/game/Scoreboard";
import Controls from "@/components/game/Controls";
import { useToast } from "@/components/ui/use-toast";

// Game states
const GAME_STATES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'game_over'
};

const Play = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gameState, setGameState] = useState(GAME_STATES.WAITING);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [winner, setWinner] = useState<string | null>(null);
  const [isSinglePlayer, setIsSinglePlayer] = useState(true);
  
  // Control states
  const controlsRef = useRef({
    playerLeft: { up: false, down: false },
    playerRight: { up: false, down: false },
  });
  
  // Handle score updates coming from the game component
  const handleScore = (player: 'player1' | 'player2') => {
    setScores(prev => {
      const newScores = { 
        ...prev, 
        [player]: prev[player] + 1 
      };
      
      // Check for game winner
      if (newScores[player] >= 11) {
        setGameState(GAME_STATES.GAME_OVER);
        setWinner(player === 'player1' ? 'Player 1' : 'Player 2');
      }
      
      return newScores;
    });
    
    // Show toast notification
    toast({
      title: `Point scored!`,
      description: `${player === 'player1' ? 'Player 1' : 'Player 2'} scored a point!`,
      duration: 2000,
    });
  };

  const startGame = (singlePlayer: boolean) => {
    setIsSinglePlayer(singlePlayer);
    setGameState(GAME_STATES.PLAYING);
    setScores({ player1: 0, player2: 0 });
    setWinner(null);
    
    toast({
      title: "Game started!",
      description: singlePlayer ? "You're playing against the AI" : "Two player mode activated",
    });
  };

  const pauseGame = () => {
    setGameState(prev => prev === GAME_STATES.PAUSED ? GAME_STATES.PLAYING : GAME_STATES.PAUSED);
  };

  const resetGame = () => {
    setGameState(GAME_STATES.WAITING);
    setScores({ player1: 0, player2: 0 });
    setWinner(null);
  };

  // Set up keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== GAME_STATES.PLAYING) return;
      
      switch(e.key) {
        case 'w':
          controlsRef.current.playerLeft.up = true;
          break;
        case 's':
          controlsRef.current.playerLeft.down = true;
          break;
        case 'ArrowUp':
          controlsRef.current.playerRight.up = true;
          break;
        case 'ArrowDown':
          controlsRef.current.playerRight.down = true;
          break;
        case 'Escape':
          pauseGame();
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'w':
          controlsRef.current.playerLeft.up = false;
          break;
        case 's':
          controlsRef.current.playerLeft.down = false;
          break;
        case 'ArrowUp':
          controlsRef.current.playerRight.up = false;
          break;
        case 'ArrowDown':
          controlsRef.current.playerRight.down = false;
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Game Canvas */}
      <div className="relative flex-1">
        {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED) && (
          <Canvas className="w-full h-full">
            <PongGame 
              controlsRef={controlsRef}
              onScore={handleScore}
              isPaused={gameState === GAME_STATES.PAUSED}
              isSinglePlayer={isSinglePlayer}
            />
          </Canvas>
        )}
        
        {/* Overlay for non-playing states */}
        {gameState !== GAME_STATES.PLAYING && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
            {gameState === GAME_STATES.WAITING && (
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-8 neon-text-blue">SELECT GAME MODE</h2>
                <div className="flex flex-col space-y-4">
                  <Button 
                    onClick={() => startGame(true)} 
                    className="neon-btn text-xl w-64 h-12"
                  >
                    SINGLE PLAYER
                  </Button>
                  <Button 
                    onClick={() => startGame(false)} 
                    className="neon-btn text-xl w-64 h-12"
                  >
                    TWO PLAYERS
                  </Button>
                  <Button 
                    onClick={() => navigate('/')} 
                    className="text-white/70 hover:text-white mt-8"
                    variant="ghost"
                  >
                    BACK TO MENU
                  </Button>
                </div>
              </div>
            )}
            
            {gameState === GAME_STATES.PAUSED && (
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-8 neon-text-pink">GAME PAUSED</h2>
                <div className="flex flex-col space-y-4">
                  <Button 
                    onClick={pauseGame} 
                    className="neon-btn text-xl w-64 h-12"
                  >
                    RESUME
                  </Button>
                  <Button 
                    onClick={resetGame} 
                    className="neon-btn text-xl w-64 h-12"
                    variant="outline"
                  >
                    QUIT GAME
                  </Button>
                </div>
              </div>
            )}
            
            {gameState === GAME_STATES.GAME_OVER && (
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-2 neon-text-blue">GAME OVER</h2>
                <p className="text-2xl mb-8 text-white">{winner} wins!</p>
                <div className="flex flex-col space-y-4">
                  <Button 
                    onClick={() => startGame(isSinglePlayer)} 
                    className="neon-btn text-xl w-64 h-12"
                  >
                    PLAY AGAIN
                  </Button>
                  <Button 
                    onClick={resetGame} 
                    className="neon-btn text-xl w-64 h-12"
                    variant="outline"
                  >
                    MAIN MENU
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scoreboard - Always visible during gameplay */}
        {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED) && (
          <div className="absolute top-0 left-0 w-full p-4">
            <Scoreboard 
              player1Score={scores.player1} 
              player2Score={scores.player2} 
            />
          </div>
        )}

        {/* Mobile Controls - Always visible during gameplay on small screens */}
        {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.PAUSED) && (
          <div className="md:hidden">
            <Controls 
              controlsRef={controlsRef} 
              onPause={pauseGame} 
            />
          </div>
        )}

        {/* Pause button for desktop */}
        {gameState === GAME_STATES.PLAYING && (
          <div className="absolute top-4 right-4 hidden md:block">
            <Button 
              onClick={pauseGame} 
              variant="outline" 
              className="bg-black bg-opacity-50 border border-neon-blue/30 text-white"
            >
              PAUSE
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;
