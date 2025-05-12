
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Keyboard } from "lucide-react";

const Instructions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background grid-bg p-4">
      <div className="w-full max-w-4xl bg-black bg-opacity-70 rounded-xl p-6 border border-neon-blue/30">
        <h1 className="text-4xl font-bold mb-8 neon-text-blue text-center">HOW TO PLAY</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl mb-4 text-neon-pink">Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black bg-opacity-50 p-4 rounded-lg">
              <h3 className="text-xl mb-2 text-white flex items-center">
                <Keyboard className="mr-2" /> Player 1 (Left)
              </h3>
              <ul className="list-disc pl-5 text-white/80">
                <li className="mb-2">Press <span className="text-neon-blue font-bold">W</span> to move paddle up</li>
                <li className="mb-2">Press <span className="text-neon-blue font-bold">S</span> to move paddle down</li>
              </ul>
            </div>
            
            <div className="bg-black bg-opacity-50 p-4 rounded-lg">
              <h3 className="text-xl mb-2 text-white flex items-center">
                <Keyboard className="mr-2" /> Player 2 (Right)
              </h3>
              <ul className="list-disc pl-5 text-white/80">
                <li className="mb-2">Press <span className="text-neon-blue font-bold">UP ARROW</span> to move paddle up</li>
                <li className="mb-2">Press <span className="text-neon-blue font-bold">DOWN ARROW</span> to move paddle down</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl mb-4 text-neon-pink">Game Rules</h2>
          <ul className="list-disc pl-5 text-white/80">
            <li className="mb-2">Move your paddle to hit the ball and prevent it from passing your side</li>
            <li className="mb-2">Each time the ball passes a player's paddle, the opponent scores a point</li>
            <li className="mb-2">The ball speeds up with each hit, making the game progressively more challenging</li>
            <li className="mb-2">First player to reach 11 points wins the match</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl mb-4 text-neon-pink">Tips</h2>
          <ul className="list-disc pl-5 text-white/80">
            <li className="mb-2">Anticipate the ball's trajectory based on the angle it hits your paddle</li>
            <li className="mb-2">Try to position your paddle in the middle when waiting for the ball</li>
            <li className="mb-2">The ball bounces off the top and bottom walls, use this to your advantage</li>
          </ul>
        </div>
        
        <div className="flex justify-center mt-10">
          <Button 
            onClick={() => navigate('/play')}
            className="neon-btn text-xl w-64 h-12"
          >
            START PLAYING
          </Button>
        </div>
      </div>
      
      <Button 
        onClick={() => navigate('/')}
        className="mt-8 text-white/70 hover:text-white"
        variant="ghost"
      >
        Back to Home
      </Button>
    </div>
  );
};

export default Instructions;
