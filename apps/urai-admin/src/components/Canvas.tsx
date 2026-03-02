'use client';

import { useRef, useEffect } from 'react';

// Define the structure of our scene and its elements
interface Shape {
  id: string;
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  fill: string;
}

interface Scene {
  width: number;
  height: number;
  elements: Shape[];
}

// Initial scene state
const initialScene: Scene = {
  width: 800,
  height: 600,
  elements: [
    { id: 'rect1', type: 'rectangle', x: 50, y: 50, width: 100, height: 100, fill: 'red' },
    { id: 'circle1', type: 'circle', x: 200, y: 150, radius: 50, fill: 'blue' },
  ],
};

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, initialScene.width, initialScene.height);

        // Draw elements
        initialScene.elements.forEach(element => {
          ctx.fillStyle = element.fill;
          if (element.type === 'rectangle' && element.width && element.height) {
            ctx.fillRect(element.x, element.y, element.width, element.height);
          } else if (element.type === 'circle' && element.radius) {
            ctx.beginPath();
            ctx.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
            ctx.fill();
          }
        });
      }
    }
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Canvas Scene</h2>
      <canvas
        ref={canvasRef}
        width={initialScene.width}
        height={initialScene.height}
        className="border border-gray-300 rounded-lg"
      />
    </div>
  );
}
