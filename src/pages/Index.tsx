
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background grid-bg">
      <div className="w-full max-w-4xl px-4 py-8 text-center">
        <h1 className="text-6xl font-bold mb-6 neon-text-blue animate-neon-pulse">NEON PONG</h1>
        <p className="text-xl mb-10 text-white/80">
          Experience the classic arcade game in immersive 3D
        </p>
        
        <div className="flex flex-col gap-6 items-center">
          <Button 
            onClick={() => navigate('/play')} 
            className="neon-btn text-xl w-64 h-12"
          >
            PLAY NOW
          </Button>
          
          <Button 
            onClick={() => navigate('/instructions')} 
            className="neon-btn text-xl w-64 h-12"
            variant="outline"
          >
            INSTRUCTIONS
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-lg bg-black bg-opacity-50 border border-neon-blue/30">
            <h3 className="text-lg font-semibold mb-2 neon-text-blue">3D GRAPHICS</h3>
            <p className="text-white/70">Experience Pong in an immersive three-dimensional arena with dynamic lighting and effects</p>
          </div>
          
          <div className="p-6 rounded-lg bg-black bg-opacity-50 border border-neon-blue/30">
            <h3 className="text-lg font-semibold mb-2 neon-text-blue">MULTIPLAYER</h3>
            <p className="text-white/70">Challenge your friends or play against opponents around the world in real-time</p>
          </div>
          
          <div className="p-6 rounded-lg bg-black bg-opacity-50 border border-neon-blue/30">
            <h3 className="text-lg font-semibold mb-2 neon-text-blue">RETRO ARCADE</h3>
            <p className="text-white/70">Classic Pong gameplay with a modern twist and exciting neon aesthetics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
