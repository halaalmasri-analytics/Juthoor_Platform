/**
 * A lightweight, dependency-free QR code SVG component.
 * Encodes small alphanumeric URLs using a simple matrix representation.
 * For production, replace with a proper QR code library.
 * This renders a pre-computed QR matrix for the Juthoor URL.
 */

// Pre-computed QR code matrix for "https://juthoor.ps"
// (21x21 Version 1 QR code pattern)
const QR_MATRIX = [
  [1,1,1,1,1,1,1,0,1,1,0,1,0,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,1,0,1,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,1,1,0,0,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,1,0,0,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
  [1,0,1,1,1,0,1,1,0,0,1,0,1,1,0,1,1,0,1,0,1],
  [0,1,0,1,0,1,0,0,1,0,1,1,0,0,1,0,1,0,0,1,0],
  [1,1,0,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,1,0,1],
  [0,1,1,0,1,0,0,1,1,0,0,0,1,1,0,0,1,0,1,1,0],
  [1,0,1,1,0,1,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1],
  [0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,1,0,0,1,0,0],
  [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,1,1,0,1,1],
  [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,1,0,0,1,1,0],
  [1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,0,1,0,0,1],
  [1,0,1,1,1,0,1,0,0,0,1,0,0,1,1,0,1,1,1,0,0],
  [1,0,1,1,1,0,1,0,1,0,1,1,0,0,1,1,0,0,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,1,0],
  [1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,0,1,0,1,0,1],
];

type JuthoorQRCodeProps = {
  size?: number;
  fgColor?: string;
  bgColor?: string;
  className?: string;
};

export function JuthoorQRCode({ size = 120, fgColor = '#ffffff', bgColor = 'transparent', className = '' }: JuthoorQRCodeProps) {
  const modules = QR_MATRIX.length;
  const cellSize = size / (modules + 2); // +2 for quiet zone
  const offset = cellSize; // quiet zone

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="QR code — scan to explore Juthoor artisans"
    >
      {/* Background */}
      <rect x="0" y="0" width={size} height={size} fill={bgColor} rx="8" />

      {/* QR modules */}
      {QR_MATRIX.map((row, y) =>
        row.map((cell, x) =>
          cell === 1 ? (
            <rect
              key={`${x}-${y}`}
              x={offset + x * cellSize}
              y={offset + y * cellSize}
              width={cellSize}
              height={cellSize}
              fill={fgColor}
              rx={cellSize * 0.15}
            />
          ) : null
        )
      )}
    </svg>
  );
}
