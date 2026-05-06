import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Move, ZoomIn, ZoomOut, RotateCw, Camera, Smartphone } from 'lucide-react';

type ARPreviewProps = {
  imageUrl: string;
  productName: string;
  onClose: () => void;
};

export function ARPreview({ imageUrl, productName, onClose }: ARPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [productScale, setProductScale] = useState(0.35);
  const [productRotation, setProductRotation] = useState(0);
  const [productPos, setProductPos] = useState({ x: 50, y: 50 }); // percentage of container
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [snapped, setSnapped] = useState(false);
  const productImgRef = useRef<HTMLImageElement | null>(null);

  // Load the product image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      productImgRef.current = img;
    };
  }, [imageUrl]);

  // Start camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch (err: any) {
        console.error('Camera error:', err);
        setCameraError(
          err.name === 'NotAllowedError'
            ? 'Camera access was denied. Please allow camera permissions and try again.'
            : 'Unable to access camera. Please make sure your device has a camera available.'
        );
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle pointer events for dragging the product overlay
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;

      // Check if the pointer is near the product
      const dx = px - productPos.x;
      const dy = py - productPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < productScale * 60) {
        setIsDragging(true);
        setDragOffset({ x: dx, y: dy });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }
    },
    [productPos, productScale]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top) / rect.height) * 100;
      setProductPos({
        x: Math.max(5, Math.min(95, px - dragOffset.x)),
        y: Math.max(5, Math.min(95, py - dragOffset.y)),
      });
    },
    [isDragging, dragOffset]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Snapshot function
  const handleSnapshot = () => {
    if (!canvasRef.current || !videoRef.current || !productImgRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const video = videoRef.current;
    canvas.width = video.videoWidth || 1920;
    canvas.height = video.videoHeight || 1080;

    // Draw camera frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw product overlay
    const img = productImgRef.current;
    const scale = productScale;
    const imgW = canvas.width * scale;
    const imgH = (img.height / img.width) * imgW;
    const posX = (productPos.x / 100) * canvas.width - imgW / 2;
    const posY = (productPos.y / 100) * canvas.height - imgH / 2;

    ctx.save();
    ctx.translate(posX + imgW / 2, posY + imgH / 2);
    ctx.rotate((productRotation * Math.PI) / 180);

    // Subtle shadow for realism
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 15;

    ctx.drawImage(img, -imgW / 2, -imgH / 2, imgW, imgH);
    ctx.restore();

    // Download
    const link = document.createElement('a');
    link.download = `juthoor-ar-${productName.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setSnapped(true);
    setTimeout(() => setSnapped(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Hidden canvas for snapshots */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Error State */}
      {cameraError && (
        <div className="h-full flex flex-col items-center justify-center text-white p-8 text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-md border border-white/10">
            <Smartphone className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Camera Access Needed</h2>
            <p className="text-gray-300 leading-relaxed mb-8">{cameraError}</p>
            <button onClick={onClose} className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 transition">
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Camera Feed + Overlay */}
      {!cameraError && (
        <div
          ref={containerRef}
          className="relative w-full h-full overflow-hidden touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Video Feed */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />

          {/* Loading overlay */}
          {!cameraReady && (
            <div className="absolute inset-0 bg-black flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6" />
                <p className="text-lg font-medium">Initializing camera...</p>
              </div>
            </div>
          )}

          {/* Product Image Overlay */}
          {cameraReady && productImgRef.current && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${productPos.x}%`,
                top: `${productPos.y}%`,
                transform: `translate(-50%, -50%) scale(${productScale}) rotate(${productRotation}deg)`,
                transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.35))',
                maxWidth: '80vw',
              }}
            >
              <img
                src={imageUrl}
                alt={productName}
                className="w-[500px] max-w-none rounded-lg"
                draggable={false}
              />
            </div>
          )}

          {/* Crosshair / Placement guide */}
          {cameraReady && !isDragging && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-dashed border-white/20 rounded-3xl" />
            </div>
          )}

          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              className="bg-black/40 backdrop-blur-md text-white p-3 rounded-2xl hover:bg-black/60 transition border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="bg-black/40 backdrop-blur-md text-white px-5 py-2.5 rounded-2xl text-sm font-bold border border-white/10 flex items-center gap-2">
              <Move className="w-4 h-4 text-amber-400" />
              Drag to place • Pinch to resize
            </div>
          </div>

          {/* Bottom Controls */}
          {cameraReady && (
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              {/* Product Info Pill */}
              <div className="bg-black/40 backdrop-blur-md text-white px-6 py-3 rounded-2xl mb-4 text-center border border-white/10 max-w-md mx-auto">
                <p className="font-bold text-sm">{productName}</p>
                <p className="text-xs text-green-300 mt-0.5">AR Preview Mode</p>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setProductScale((s) => Math.max(0.1, s - 0.05))}
                  className="bg-white/15 backdrop-blur-md text-white p-3.5 rounded-2xl hover:bg-white/25 transition border border-white/10"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setProductScale((s) => Math.min(1.2, s + 0.05))}
                  className="bg-white/15 backdrop-blur-md text-white p-3.5 rounded-2xl hover:bg-white/25 transition border border-white/10"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setProductRotation((r) => r + 15)}
                  className="bg-white/15 backdrop-blur-md text-white p-3.5 rounded-2xl hover:bg-white/25 transition border border-white/10"
                  title="Rotate"
                >
                  <RotateCw className="w-5 h-5" />
                </button>

                {/* Snapshot / Capture Button */}
                <button
                  onClick={handleSnapshot}
                  className={`p-4 rounded-full transition-all duration-300 border-4 ${
                    snapped
                      ? 'bg-green-500 border-green-300 scale-90'
                      : 'bg-white border-white/50 hover:scale-105'
                  }`}
                  title="Capture Screenshot"
                >
                  <Camera className={`w-7 h-7 ${snapped ? 'text-white' : 'text-green-900'}`} />
                </button>

                {/* Reset */}
                <button
                  onClick={() => {
                    setProductPos({ x: 50, y: 50 });
                    setProductScale(0.35);
                    setProductRotation(0);
                  }}
                  className="bg-white/15 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl hover:bg-white/25 transition text-sm font-bold border border-white/10"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Snapshot flash effect */}
          {snapped && (
            <div className="absolute inset-0 bg-white/80 animate-ping pointer-events-none" style={{ animationDuration: '0.3s', animationIterationCount: 1 }} />
          )}
        </div>
      )}
    </div>
  );
}
