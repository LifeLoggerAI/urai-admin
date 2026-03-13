'use client';
import { useRef, useEffect } from 'react';
// Initial scene state
var initialScene = {
    width: 800,
    height: 600,
    elements: [
        { id: 'rect1', type: 'rectangle', x: 50, y: 50, width: 100, height: 100, fill: 'red' },
        { id: 'circle1', type: 'circle', x: 200, y: 150, radius: 50, fill: 'blue' },
    ],
};
export default function Canvas() {
    var canvasRef = useRef(null);
    useEffect(function () {
        var canvas = canvasRef.current;
        if (canvas) {
            var ctx_1 = canvas.getContext('2d');
            if (ctx_1) {
                // Clear canvas
                ctx_1.clearRect(0, 0, initialScene.width, initialScene.height);
                // Draw elements
                initialScene.elements.forEach(function (element) {
                    ctx_1.fillStyle = element.fill;
                    if (element.type === 'rectangle' && element.width && element.height) {
                        ctx_1.fillRect(element.x, element.y, element.width, element.height);
                    }
                    else if (element.type === 'circle' && element.radius) {
                        ctx_1.beginPath();
                        ctx_1.arc(element.x, element.y, element.radius, 0, 2 * Math.PI);
                        ctx_1.fill();
                    }
                });
            }
        }
    }, []);
    return (<div>
      <h2 className="text-xl font-bold mb-4">Canvas Scene</h2>
      <canvas ref={canvasRef} width={initialScene.width} height={initialScene.height} className="border border-gray-300 rounded-lg"/>
    </div>);
}
