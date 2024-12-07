import { NameBubble } from '../types';

interface GridCell {
  x: number;
  y: number;
  occupied: boolean;
}

const MARGIN = 100; // Margin from container edges

export function calculateNamePositions(
  containerWidth: number,
  containerHeight: number,
  nameCount: number,
  minDistance: number = 100,
  startInView: boolean = true
): { x: number; y: number }[] {
  if (!containerWidth || !containerHeight) {
    return Array(nameCount).fill(null).map(() => ({
      x: MARGIN,
      y: startInView ? 0 : -100
    }));
  }

  const availableWidth = containerWidth - (2 * MARGIN);
  const gridSize = Math.min(availableWidth, containerHeight) / 8;
  const cols = Math.max(1, Math.floor(availableWidth / gridSize));
  const rows = Math.max(1, Math.floor(containerHeight / gridSize));
  
  // Initialize grid with proper dimensions
  const grid: GridCell[][] = [];
  for (let row = 0; row < rows; row++) {
    grid[row] = [];
    for (let col = 0; col < cols; col++) {
      grid[row][col] = {
        x: MARGIN + (col * gridSize) + Math.random() * (gridSize / 2),
        y: row * gridSize + Math.random() * (gridSize / 2),
        occupied: false
      };
    }
  }
  
  const positions: { x: number; y: number }[] = [];
  const usedCells = new Set<string>();
  
  const isTooClose = (x: number, y: number): boolean => {
    return positions.some(pos => 
      Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2)) < minDistance
    );
  };
  
  const getInitialY = () => {
    if (startInView) {
      return Math.random() * (containerHeight - 200) + MARGIN;
    }
    return -100 - Math.random() * containerHeight;
  };
  
  for (let i = 0; i < nameCount; i++) {
    let attempts = 0;
    let position: { x: number; y: number } | null = null;
    
    while (attempts < 50 && !position) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      const cellKey = `${row}-${col}`;
      
      if (!usedCells.has(cellKey) && grid[row] && grid[row][col]) {
        const cell = grid[row][col];
        const x = Math.min(Math.max(cell.x, MARGIN), containerWidth - MARGIN);
        const y = getInitialY();
        
        if (!isTooClose(x, y)) {
          position = { x, y };
          usedCells.add(cellKey);
        }
      }
      attempts++;
    }
    
    if (!position) {
      // Fallback position if no valid position found
      position = {
        x: MARGIN + Math.random() * (containerWidth - 2 * MARGIN),
        y: getInitialY()
      };
    }
    
    positions.push(position);
  }
  
  return positions;
}

export function redistributeBubbles(
  bubbles: NameBubble[],
  containerWidth: number,
  containerHeight: number
): NameBubble[] {
  const positions = calculateNamePositions(containerWidth, containerHeight, bubbles.length, 100, true);
  
  return bubbles.map((bubble, index) => ({
    ...bubble,
    x: positions[index].x,
    y: positions[index].y
  }));
}