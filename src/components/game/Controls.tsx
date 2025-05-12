
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Pause } from "lucide-react";

type ControlsProps = {
  controlsRef: React.RefObject<{
    playerLeft: { up: boolean; down: boolean };
    playerRight: { up: boolean; down: boolean };
  }>;
  onPause: () => void;
};

const Controls = ({ controlsRef, onPause }: ControlsProps) => {
  // Handle player 1 controls (left paddle)
  const handleLeftPaddleUp = (isPressed: boolean) => {
    if (controlsRef.current) {
      controlsRef.current.playerLeft.up = isPressed;
    }
  };
  
  const handleLeftPaddleDown = (isPressed: boolean) => {
    if (controlsRef.current) {
      controlsRef.current.playerLeft.down = isPressed;
    }
  };
  
  // Handle player 2 controls (right paddle)
  const handleRightPaddleUp = (isPressed: boolean) => {
    if (controlsRef.current) {
      controlsRef.current.playerRight.up = isPressed;
    }
  };
  
  const handleRightPaddleDown = (isPressed: boolean) => {
    if (controlsRef.current) {
      controlsRef.current.playerRight.down = isPressed;
    }
  };
  
  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-between px-4">
      {/* Left paddle controls */}
      <div className="flex flex-col space-y-2">
        <Button 
          variant="outline" 
          className="w-16 h-16 rounded-full bg-black bg-opacity-30 border-neon-pink border-2"
          onPointerDown={() => handleLeftPaddleUp(true)}
          onPointerUp={() => handleLeftPaddleUp(false)}
          onPointerLeave={() => handleLeftPaddleUp(false)}
        >
          <ChevronUp size={32} className="text-neon-pink" />
        </Button>
        <Button 
          variant="outline" 
          className="w-16 h-16 rounded-full bg-black bg-opacity-30 border-neon-pink border-2"
          onPointerDown={() => handleLeftPaddleDown(true)}
          onPointerUp={() => handleLeftPaddleDown(false)}
          onPointerLeave={() => handleLeftPaddleDown(false)}
        >
          <ChevronDown size={32} className="text-neon-pink" />
        </Button>
      </div>
      
      {/* Center - Pause button */}
      <div className="flex items-end">
        <Button 
          variant="outline" 
          className="w-12 h-12 rounded-full bg-black bg-opacity-50 border-white border"
          onClick={onPause}
        >
          <Pause className="text-white" />
        </Button>
      </div>
      
      {/* Right paddle controls */}
      <div className="flex flex-col space-y-2">
        <Button 
          variant="outline" 
          className="w-16 h-16 rounded-full bg-black bg-opacity-30 border-neon-blue border-2"
          onPointerDown={() => handleRightPaddleUp(true)}
          onPointerUp={() => handleRightPaddleUp(false)}
          onPointerLeave={() => handleRightPaddleUp(false)}
        >
          <ChevronUp size={32} className="text-neon-blue" />
        </Button>
        <Button 
          variant="outline" 
          className="w-16 h-16 rounded-full bg-black bg-opacity-30 border-neon-blue border-2"
          onPointerDown={() => handleRightPaddleDown(true)}
          onPointerUp={() => handleRightPaddleDown(false)}
          onPointerLeave={() => handleRightPaddleDown(false)}
        >
          <ChevronDown size={32} className="text-neon-blue" />
        </Button>
      </div>
    </div>
  );
};

export default Controls;
