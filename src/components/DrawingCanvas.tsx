import React, {
  useImperativeHandle,
  forwardRef,
  useRef,
  useEffect,
} from "react";

export interface SketchCanvasRef {
  getImageBlob: () => Promise<Blob>;
}

export const SketchCanvas = forwardRef<SketchCanvasRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useImperativeHandle(ref, () => ({
    getImageBlob: () => {
      return new Promise((resolve) => {
        if (!canvasRef.current) return;

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          }
        }, "image/png");
      });
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let drawing = false;

    const start = (e: MouseEvent) => {
      drawing = true;
      draw(e);
    };

    const end = () => {
      drawing = false;
      ctx.beginPath();
    };

    const draw = (e: MouseEvent) => {
      if (!drawing) return;

      const rect = canvas.getBoundingClientRect();
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#000000";

      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("mousemove", draw);
    };
  }, []);

  return (
    <div className="border border-gray-300 rounded w-full mt-2">
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        className="w-full bg-white"
      />
    </div>
  );
});

SketchCanvas.displayName = "SketchCanvas";
