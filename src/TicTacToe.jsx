import { useState, useEffect } from "react";

const WINNING_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function checkWinner(board) {
  for (const [a,b,c] of WINNING_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return { winner: board[a], line: [a,b,c] };
  }
  if (board.every(Boolean)) return { winner: "Draw", line: [] };
  return null;
}

function getBestMove(board, isMaximizing) {
  const result = checkWinner(board);
  if (result?.winner === "O") return { score: 10 };
  if (result?.winner === "X") return { score: -10 };
  if (result?.winner === "Draw") return { score: 0 };

  const moves = [];
  board.forEach((cell, i) => {
    if (!cell) {
      const newBoard = [...board];
      newBoard[i] = isMaximizing ? "O" : "X";
      const score = getBestMove(newBoard, !isMaximizing).score;
      moves.push({ index: i, score });
    }
  });

  return moves.reduce((best, move) =>
    isMaximizing ? (move.score > best.score ? move : best)
                 : (move.score < best.score ? move : best)
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0d1117;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Rajdhani', sans-serif;
  }

  .app {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 28px;
    padding: 40px 20px;
    min-height: 100vh;
    justify-content: center;
    background: radial-gradient(ellipse at 20% 20%, rgba(0,200,200,0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(255,50,50,0.05) 0%, transparent 50%),
                #0d1117;
  }

  .title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(20px, 4vw, 32px);
    font-weight: 900;
    color: #fff;
    letter-spacing: 4px;
    text-transform: uppercase;
    text-align: center;
  }
  .title span { color: #00e5e5; }

  .mode-select {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn {
    font-family: 'Orbitron', monospace;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    padding: 10px 22px;
    border: 1.5px solid #00e5e5;
    background: transparent;
    color: #00e5e5;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
  }
  .btn:hover, .btn.active {
    background: #00e5e5;
    color: #0d1117;
  }
  .btn.danger {
    border-color: #ff4444;
    color: #ff4444;
  }
  .btn.danger:hover { background: #ff4444; color: #0d1117; }

  .scoreboard {
    display: flex;
    gap: 0;
    border: 1px solid #1e2d3d;
    overflow: hidden;
    clip-path: polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%);
  }
  .score-item {
    padding: 14px 28px;
    text-align: center;
    background: #0a0f1a;
    border-right: 1px solid #1e2d3d;
    min-width: 90px;
  }
  .score-item:last-child { border-right: none; }
  .score-label {
    font-family: 'Orbitron', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    color: #556;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .score-val {
    font-family: 'Orbitron', monospace;
    font-size: 26px;
    font-weight: 900;
    color: #fff;
  }
  .score-item.x .score-val { color: #00e5e5; }
  .score-item.o .score-val { color: #ff4444; }

  .status {
    font-family: 'Orbitron', monospace;
    font-size: 13px;
    letter-spacing: 2px;
    color: #aab;
    text-transform: uppercase;
    text-align: center;
    min-height: 20px;
  }
  .status.win { color: #00e5e5; }
  .status.draw { color: #ffa500; }

  .board {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    padding: 8px;
    background: #111820;
    border: 1px solid #1e2d3d;
    position: relative;
  }

  .cell {
    width: clamp(90px, 22vw, 120px);
    height: clamp(90px, 22vw, 120px);
    background: #0a0f1a;
    border: 1px solid #1e2d3d;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', monospace;
    font-size: clamp(28px, 8vw, 46px);
    font-weight: 900;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    position: relative;
    overflow: hidden;
    user-select: none;
  }
  .cell:hover:not(.taken) {
    background: #0e1a28;
    border-color: #2a4060;
  }
  .cell.taken { cursor: default; }
  .cell.x { color: #00e5e5; }
  .cell.o { color: #ff4444; }
  .cell.winning {
    background: #0e1a28;
    border-color: currentColor;
    animation: pulse 0.6s ease;
  }
  .cell.winning.x { border-color: #00e5e5; }
  .cell.winning.o { border-color: #ff4444; }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .cell::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, rgba(0,229,229,0.08), transparent);
    opacity: 0;
    transition: opacity 0.15s;
  }
  .cell:hover:not(.taken)::before { opacity: 1; }

  .turn-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #556;
    letter-spacing: 1px;
  }
  .turn-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #00e5e5;
  }
  .turn-dot.o { background: #ff4444; }

  .corner {
    position: fixed;
    width: 60px; height: 60px;
    border-color: #00e5e5;
    border-style: solid;
    opacity: 0.3;
  }
  .corner.tl { top: 16px; left: 16px; border-width: 2px 0 0 2px; }
  .corner.tr { top: 16px; right: 16px; border-width: 2px 2px 0 0; }
  .corner.bl { bottom: 16px; left: 16px; border-width: 0 0 2px 2px; }
  .corner.br { bottom: 16px; right: 16px; border-width: 0 2px 2px 0; }
`;

export default function TicTacToe() {
  const [mode, setMode] = useState("pvp"); // pvp or pvc
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isX, setIsX] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Draw: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [winLine, setWinLine] = useState([]);
  const [thinking, setThinking] = useState(false);

  const result = checkWinner(board);

  useEffect(() => {
    if (result && !gameOver) {
      setGameOver(true);
      setWinLine(result.line);
      setScores(s => ({ ...s, [result.winner]: s[result.winner] + 1 }));
    }
  }, [board]);

  useEffect(() => {
    if (mode === "pvc" && !isX && !gameOver) {
      setThinking(true);
      const timer = setTimeout(() => {
        const move = getBestMove([...board], true);
        if (move && move.index !== undefined) {
          const newBoard = [...board];
          newBoard[move.index] = "O";
          setBoard(newBoard);
          setIsX(true);
        }
        setThinking(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isX, mode, gameOver]);

  const handleClick = (i) => {
    if (board[i] || gameOver || thinking) return;
    if (mode === "pvc" && !isX) return;
    const newBoard = [...board];
    newBoard[i] = isX ? "X" : "O";
    setBoard(newBoard);
    setIsX(!isX);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setIsX(true);
    setGameOver(false);
    setWinLine([]);
    setThinking(false);
  };

  const resetAll = () => {
    reset();
    setScores({ X: 0, O: 0, Draw: 0 });
  };

  const switchMode = (m) => {
    setMode(m);
    resetAll();
  };

  let statusText = "";
  let statusClass = "";
  if (result) {
    if (result.winner === "Draw") { statusText = "DRAW — WELL PLAYED"; statusClass = "draw"; }
    else {
      const label = mode === "pvc" ? (result.winner === "X" ? "YOU WIN" : "COMPUTER WINS") : `PLAYER ${result.winner} WINS`;
      statusText = label;
      statusClass = "win";
    }
  } else if (thinking) {
    statusText = "COMPUTER THINKING...";
  } else {
    statusText = mode === "pvc"
      ? (isX ? "YOUR TURN — X" : "COMPUTER'S TURN — O")
      : `PLAYER ${isX ? "X" : "O"} TURN`;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="corner tl"/><div className="corner tr"/>
      <div className="corner bl"/><div className="corner br"/>
      <div className="app">
        <div className="title">TIC<span>-TAC-</span>TOE</div>

        <div className="mode-select">
          <button className={`btn ${mode === "pvp" ? "active" : ""}`} onClick={() => switchMode("pvp")}>
            PVP
          </button>
          <button className={`btn ${mode === "pvc" ? "active" : ""}`} onClick={() => switchMode("pvc")}>
            VS Computer
          </button>
        </div>

        <div className="scoreboard">
          <div className="score-item x">
            <div className="score-label">{mode === "pvc" ? "You" : "Player X"}</div>
            <div className="score-val">{scores.X}</div>
          </div>
          <div className="score-item">
            <div className="score-label">Draw</div>
            <div className="score-val">{scores.Draw}</div>
          </div>
          <div className="score-item o">
            <div className="score-label">{mode === "pvc" ? "CPU" : "Player O"}</div>
            <div className="score-val">{scores.O}</div>
          </div>
        </div>

        <div className={`status ${statusClass}`}>{statusText}</div>

        <div className="board">
          {board.map((cell, i) => (
            <div
              key={i}
              className={`cell ${cell ? "taken " + cell.toLowerCase() : ""} ${winLine.includes(i) ? "winning " + (cell || "").toLowerCase() : ""}`}
              onClick={() => handleClick(i)}
            >
              {cell}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn" onClick={reset}>New Game</button>
          <button className="btn danger" onClick={resetAll}>Reset All</button>
        </div>
      </div>
    </>
  );
}