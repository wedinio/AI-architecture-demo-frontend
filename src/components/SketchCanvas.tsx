import React, { useRef, forwardRef, useImperativeHandle } from "react";

export interface SketchCanvasRef {
  getImageBlob: () => Promise<Blob>;
  clearCanvas: () => void;
}

export const SketchCanvas = forwardRef<SketchCanvasRef>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);

  useImperativeHandle(ref, () => ({
    getImageBlob: async () => {
      if (!canvasRef.current) throw new Error("Canvas not ready");
      return await new Promise<Blob>((resolve) => {
        canvasRef.current!.toBlob((blob) => {
          if (blob) resolve(blob);
        }, "image/png");
      });
    },
    clearCanvas: () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    },
  }));

  const handleMouseDown = (e: React.MouseEvent) => {
    drawing.current = true;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleMouseUp = () => {
    drawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      width={512}
      height={512}
      style={{ border: "1px solid #ccc", cursor: "crosshair" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
});
