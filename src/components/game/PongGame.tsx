
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";

// Constants from the original game
const PADDLE_SPEED = 0.1;
const INITIAL_BALL_SPEED = 0.05;
const ARENA_WIDTH = 20;
const ARENA_HEIGHT = 10;
const ARENA_DEPTH = 5;
const PADDLE_WIDTH = 0.3;
const PADDLE_HEIGHT = 2;
const PADDLE_DEPTH = 0.5;
const BALL_SIZE = 0.3;
const WALL_THICKNESS = 0.3;

// Game types
type Controls = {
  playerLeft: { up: boolean; down: boolean };
  playerRight: { up: boolean; down: boolean };
};

type PongGameProps = {
  controlsRef: React.RefObject<Controls>;
  onScore: (player: 'player1' | 'player2') => void;
  isPaused: boolean;
  isSinglePlayer: boolean;
};

const PongGame = ({ controlsRef, onScore, isPaused, isSinglePlayer }: PongGameProps) => {
  // References for game objects
  const leftPaddleRef = useRef<THREE.Mesh>(null);
  const rightPaddleRef = useRef<THREE.Mesh>(null);
  const ballRef = useRef<THREE.Mesh>(null);
  
  // Game state
  const gameState = useRef({
    ballSpeed: INITIAL_BALL_SPEED,
    ballDirection: new THREE.Vector3(1, 0.5, 0).normalize(),
    lastScoreTime: 0,
    aiDifficulty: 0.5,  // Value between 0-1, higher is more difficult
  });
  
  // Set up lighting
  const { viewport } = useThree();
  
  // Reset ball position and direction
  const resetBall = (direction: number) => {
    if (!ballRef.current) return;
    
    ballRef.current.position.set(0, 0, 0);
    gameState.current.ballSpeed = INITIAL_BALL_SPEED;
    
    // Determine new ball direction - negative means left, positive means right
    const randomY = Math.random() * 1 - 0.5;  // Between -0.5 and 0.5
    gameState.current.ballDirection = new THREE.Vector3(direction, randomY, 0).normalize();
    
    // Prevent scoring immediately after reset
    gameState.current.lastScoreTime = Date.now();
  };
  
  // AI for single player mode
  const updateAI = () => {
    if (!isSinglePlayer || !rightPaddleRef.current || !ballRef.current) return;
    
    const paddle = rightPaddleRef.current;
    const ball = ballRef.current;
    const difficulty = gameState.current.aiDifficulty;
    
    // Only move AI paddle when ball is moving toward it
    if (gameState.current.ballDirection.x > 0) {
      // Predict where ball will be
      const ballYDirection = gameState.current.ballDirection.y;
      const ballSpeed = gameState.current.ballSpeed;
      const distanceToTravel = ARENA_WIDTH / 2 - ball.position.x;
      const targetY = ball.position.y + (ballYDirection * distanceToTravel / gameState.current.ballDirection.x);
      
      // Add some "imperfection" based on difficulty
      const aiError = (1 - difficulty) * (Math.random() * 2 - 1) * 2;
      const targetYWithError = targetY + aiError;
      
      // Move toward the predicted position
      const paddleY = paddle.position.y;
      const distanceToTarget = targetYWithError - paddleY;
      
      // Only move if the ball isn't too close to the center
      if (Math.abs(distanceToTarget) > 0.2) {
        const direction = distanceToTarget > 0 ? 1 : -1;
        const speed = PADDLE_SPEED * difficulty;
        
        // Move paddle with speed constraint
        const newY = paddleY + direction * speed;
        const clampedY = Math.max(
          -(ARENA_HEIGHT / 2) + PADDLE_HEIGHT / 2 + WALL_THICKNESS,
          Math.min((ARENA_HEIGHT / 2) - PADDLE_HEIGHT / 2 - WALL_THICKNESS, newY)
        );
        
        paddle.position.y = clampedY;
      }
    }
  };
  
  // Game update logic
  useFrame(() => {
    if (isPaused) return;
    
    const controls = controlsRef.current;
    if (!controls || !leftPaddleRef.current || !rightPaddleRef.current || !ballRef.current) return;
    
    // Update paddle positions
    const leftPaddle = leftPaddleRef.current;
    const rightPaddle = rightPaddleRef.current;
    const ball = ballRef.current;
    
    // Left paddle controls
    if (controls.playerLeft.up) {
      leftPaddle.position.y = Math.min(
        (ARENA_HEIGHT / 2) - PADDLE_HEIGHT / 2 - WALL_THICKNESS, 
        leftPaddle.position.y + PADDLE_SPEED
      );
    }
    if (controls.playerLeft.down) {
      leftPaddle.position.y = Math.max(
        -(ARENA_HEIGHT / 2) + PADDLE_HEIGHT / 2 + WALL_THICKNESS, 
        leftPaddle.position.y - PADDLE_SPEED
      );
    }
    
    // Right paddle controls (only in two player mode)
    if (!isSinglePlayer) {
      if (controls.playerRight.up) {
        rightPaddle.position.y = Math.min(
          (ARENA_HEIGHT / 2) - PADDLE_HEIGHT / 2 - WALL_THICKNESS, 
          rightPaddle.position.y + PADDLE_SPEED
        );
      }
      if (controls.playerRight.down) {
        rightPaddle.position.y = Math.max(
          -(ARENA_HEIGHT / 2) + PADDLE_HEIGHT / 2 + WALL_THICKNESS, 
          rightPaddle.position.y - PADDLE_SPEED
        );
      }
    } else {
      // AI controls right paddle in single player
      updateAI();
    }
    
    // Update ball position
    const { ballSpeed, ballDirection } = gameState.current;
    ball.position.x += ballDirection.x * ballSpeed;
    ball.position.y += ballDirection.y * ballSpeed;
    
    // Ball collision with top/bottom walls
    if (Math.abs(ball.position.y) > ARENA_HEIGHT / 2 - BALL_SIZE / 2 - WALL_THICKNESS) {
      gameState.current.ballDirection.y *= -1;
      // Add slight random variation to y-direction to make gameplay more interesting
      gameState.current.ballDirection.y += (Math.random() * 0.2 - 0.1);
      gameState.current.ballDirection.normalize();
    }
    
    // Ball collision with paddles
    // Left paddle collision
    if (
      ball.position.x < -ARENA_WIDTH / 2 + PADDLE_WIDTH + BALL_SIZE / 2 && 
      ball.position.x > -ARENA_WIDTH / 2 + BALL_SIZE / 2 &&
      Math.abs(ball.position.y - leftPaddle.position.y) < PADDLE_HEIGHT / 2 + BALL_SIZE / 2
    ) {
      // Bounce off left paddle
      gameState.current.ballDirection.x *= -1;
      
      // Adjust y direction based on where the ball hit the paddle
      const hitLocation = (ball.position.y - leftPaddle.position.y) / (PADDLE_HEIGHT / 2);
      gameState.current.ballDirection.y = hitLocation * 0.8;
      gameState.current.ballDirection.normalize();
      
      // Increase speed
      gameState.current.ballSpeed *= 1.05;
    }
    
    // Right paddle collision
    if (
      ball.position.x > ARENA_WIDTH / 2 - PADDLE_WIDTH - BALL_SIZE / 2 && 
      ball.position.x < ARENA_WIDTH / 2 - BALL_SIZE / 2 &&
      Math.abs(ball.position.y - rightPaddle.position.y) < PADDLE_HEIGHT / 2 + BALL_SIZE / 2
    ) {
      // Bounce off right paddle
      gameState.current.ballDirection.x *= -1;
      
      // Adjust y direction based on where the ball hit the paddle
      const hitLocation = (ball.position.y - rightPaddle.position.y) / (PADDLE_HEIGHT / 2);
      gameState.current.ballDirection.y = hitLocation * 0.8;
      gameState.current.ballDirection.normalize();
      
      // Increase speed
      gameState.current.ballSpeed *= 1.05;
    }
    
    // Scoring logic
    const now = Date.now();
    const timeSinceLastScore = now - gameState.current.lastScoreTime;
    
    // Only register scores after a brief delay to prevent multiple scores
    if (timeSinceLastScore > 500) {
      // Ball passed right boundary
      if (ball.position.x > ARENA_WIDTH / 2 + BALL_SIZE) {
        onScore('player1');
        resetBall(-1);  // Reset ball to move left
      }
      
      // Ball passed left boundary
      if (ball.position.x < -ARENA_WIDTH / 2 - BALL_SIZE) {
        onScore('player2');
        resetBall(1);  // Reset ball to move right
      }
    }
  });
  
  // Initialize game on mount
  useEffect(() => {
    resetBall(Math.random() > 0.5 ? 1 : -1);
  }, []);
  
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={0.6} />
      <pointLight position={[0, -5, 5]} intensity={0.6} color="#00f3ff" />
      <spotLight position={[0, 0, 8]} angle={Math.PI / 6} penumbra={1} intensity={1.5} castShadow />
      
      {/* Environment */}
      <Environment preset="night" />
      
      {/* Game arena */}
      <group>
        {/* Playing field */}
        <mesh 
          receiveShadow 
          position={[0, 0, -0.1]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[ARENA_WIDTH, ARENA_HEIGHT]} />
          <meshStandardMaterial 
            color="#000"  
            roughness={0.4}
            metalness={0.6}
            emissive="#111827"
          />
        </mesh>
        
        {/* Center line */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, ARENA_HEIGHT]} />
          <meshBasicMaterial color="#00f3ff" transparent opacity={0.5} />
        </mesh>
        
        {/* Top wall */}
        <mesh 
          position={[0, ARENA_HEIGHT/2 + WALL_THICKNESS/2, 0]} 
          castShadow
        >
          <boxGeometry args={[ARENA_WIDTH + WALL_THICKNESS * 2, WALL_THICKNESS, 1]} />
          <meshStandardMaterial 
            color="#00f3ff" 
            emissive="#00f3ff"
            emissiveIntensity={0.4}
            toneMapped={false}
          />
        </mesh>
        
        {/* Bottom wall */}
        <mesh 
          position={[0, -ARENA_HEIGHT/2 - WALL_THICKNESS/2, 0]} 
          castShadow
        >
          <boxGeometry args={[ARENA_WIDTH + WALL_THICKNESS * 2, WALL_THICKNESS, 1]} />
          <meshStandardMaterial 
            color="#00f3ff" 
            emissive="#00f3ff"
            emissiveIntensity={0.4}
            toneMapped={false}
          />
        </mesh>
        
        {/* Left paddle */}
        <mesh 
          ref={leftPaddleRef} 
          position={[-ARENA_WIDTH/2 + PADDLE_WIDTH/2, 0, 0]} 
          castShadow
        >
          <boxGeometry args={[PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH]} />
          <meshStandardMaterial 
            color="#ff00e5" 
            emissive="#ff00e5"
            emissiveIntensity={0.4}
            toneMapped={false}
          />
        </mesh>
        
        {/* Right paddle */}
        <mesh 
          ref={rightPaddleRef} 
          position={[ARENA_WIDTH/2 - PADDLE_WIDTH/2, 0, 0]} 
          castShadow
        >
          <boxGeometry args={[PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_DEPTH]} />
          <meshStandardMaterial 
            color="#00f3ff" 
            emissive="#00f3ff"
            emissiveIntensity={0.4}
            toneMapped={false}
          />
        </mesh>
        
        {/* Ball */}
        <mesh 
          ref={ballRef} 
          position={[0, 0, 0]} 
          castShadow
        >
          <sphereGeometry args={[BALL_SIZE, 16, 16]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>
      </group>
    </>
  );
};

export default PongGame;
