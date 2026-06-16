import React, { useRef, useState, useEffect } from 'react';

interface SignatureCanvasProps {
  value: string; // base64 string
  onChange: (base64: string) => void;
  placeholder?: string;
}

export default function SignatureCanvas({ value, onChange, placeholder = "Draw your signature here" }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set brush options
    ctx.strokeStyle = '#047857'; // emerald-700
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // If there is an existing base64 value and the user hasn't drawn yet, draw it onto the canvas
    if (value && !hasDrawn) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setHasDrawn(true);
      };
      img.src = value;
    }

    // Set responsive width
    const handleResize = () => {
      // Small deferred trigger or checking container
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        const currentData = canvas.toDataURL();
        
        // Save current contents
        const tempImg = new Image();
        tempImg.onload = () => {
          canvas.width = rect.width;
          canvas.height = 140; // fixed height
          
          // Re-draw options after resize
          ctx.strokeStyle = '#047857';
          ctx.lineWidth = 2.5;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.drawImage(tempImg, 0, 0);
        };
        tempImg.src = currentData;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Check if TouchEvent or MouseEvent
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    // Prevent screen scrolling when drawing on touchscreen
    if (e.cancelable) {
      e.preventDefault();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    if (e.cancelable) {
      e.preventDefault();
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onChange('');
  };

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative border-2 border-dashed border-emerald-200 rounded-xl bg-white p-1 hover:border-emerald-400 dynamic-transition h-[142px]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="block w-full h-[134px] cursor-crosshair touch-none"
          id="signature-canvas-pad"
        />

        {/* Paper visual hint line */}
        <div className="absolute left-6 right-6 bottom-8 border-t border-red-200/50 pointer-events-none select-none flex justify-between items-center">
          <span className="text-2xs text-red-300 font-mono tracking-widest pl-1">SIGN HERE</span>
          <span className="text-2xs text-red-200/30 text-right pr-1">🗑️ Clear first if needed</span>
        </div>

        {/* Floating Controls */}
        <div className="absolute right-2 top-2 flex gap-1.5 z-10">
          <button
            type="button"
            onClick={clearCanvas}
            className="px-2.5 py-1 text-2xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg active:scale-95 transition-all outline-hidden border border-red-100 cursor-pointer"
          >
            Clear Pad
          </button>
        </div>

        {/* Placeholder text */}
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-gray-400 select-none">
            🎨 {placeholder}
          </div>
        )}
      </div>
      <p className="text-3xs text-gray-400 italic mt-1.5 pl-1">
        Supports pens, stylus, finger touch, and mice. Sign within the dashed region.
      </p>
    </div>
  );
}
