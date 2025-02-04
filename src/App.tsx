import { useState, useEffect, useRef } from "react";
import "./index.css";

function App() {
  const [level, setLevel] = useState(1);
  const [randomArr, setRandomArr] = useState<number[]>([]);
  const [userInputArr, setUserInputArr] = useState<number[]>([]);
  const [blockIsClickable, setBlockIsClickable] = useState(true);
  const gridRef = useRef(null);
  const [cols, setCols] = useState(3);
  const generate_rn = () => Math.floor(Math.random() * (cols * cols)) + 1;

  const handleClickOnStartBtn = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    document.getElementById('options').style.display = "none";
    setRandomArr([]);
    setUserInputArr([]);
    setBlockIsClickable(false);
    await animateRandomTiles();
    setBlockIsClickable(true);
  };

  const handleClickOnBlock = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!blockIsClickable) {
      console.log("Not clickable while animating");
      return;
    }

    const { id } = e.target as HTMLDivElement;
    e.target.classList.add("flash");
    setTimeout(() => e.target.classList.remove("flash"), 500);

    setUserInputArr((prev) => [...prev, Number(id)]);
  };

  useEffect(() => {
    if (userInputArr.length === randomArr.length && randomArr.length > 0) {
      if (userInputArr.join() === randomArr.join()) {
        roundOver(true);
        setLevel((prev) => prev + 1);
        setTimeout(async () => {
          setBlockIsClickable(false);
          await animatePrevTiles();
          await animateRandomTiles();
          setBlockIsClickable(true);
        }, 2000);
      } else {
        roundOver(false);
        setLevel(1);
        setRandomArr([]);
        setUserInputArr([]);
        const btn = document.getElementById("start-btn");
        if (btn) btn.style.display = "block";
      }
    }
  }, [userInputArr]);

  const animatePrevTiles = async () => {
    setUserInputArr([]);
    for (const rn of randomArr) {
      const tile = document.getElementById(rn.toString());
      if (tile) {
        tile.classList.add("flash");
        await new Promise((resolve) =>
          setTimeout(() => {
            tile.classList.remove("flash");
            resolve();
          }, 500)
        );
      }
    }
  };

  const animateRandomTiles = async () => {
    return new Promise<void>((resolve) => {
      let rn = generate_rn();

      if(rn === randomArr[randomArr.length - 1]) rn = generate_rn();
      setRandomArr((prevArr) => [...prevArr, rn]);

      setTimeout(() => {
        const tile = document.getElementById(rn.toString());
        if (tile) {
          tile.classList.add("flash");
          setTimeout(() => {
            tile.classList.remove("flash");
            resolve();
          }, 500);
        }
      }, 500);
    });
  };

  const roundOver = (isWin: boolean) => {
    const animationClass = isWin ? "win-animate" : "lose-animate";

    setTimeout(() => {
      randomArr.forEach((e, index) => {
        const tile = document.getElementById(e.toString());
        if (tile) {
          tile.classList.add(animationClass);
          document.body.style.backgroundColor = isWin
            ? "#ffffff10"
            : "#ff000010";
          setTimeout(() => {
            tile.classList.remove(animationClass);
            document.body.style.backgroundColor = "#0a0a0a";
          }, 500);
        }
      });
    }, 100);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-10">
      <h1 className="text-5xl text-white">
        Can You Remember? ( Level{" "}
        <span className="italic bg-indigo-800 p-2">{level}</span> )
      </h1>

      <div className="flex gap-5 justify-around" id="options">
        <button className="op-button" onClick={() => setCols(3)}>3x3</button>
        <button className="op-button" onClick={() => setCols(4)}>4x4</button>
        <button className="op-button" onClick={() => setCols(5)}>5x5</button>
        <button
          id="start-btn"
          onClick={handleClickOnStartBtn}
          className="border-3 cursor-pointer bg-indigo-500 p-4 rounded-xl"
        >
          Start
        </button>
      </div>
      {/* grid-cols-3
    grid-cols-4
    grid-cols-5 */}
      <div
        ref={gridRef}
        className={`w-96 h-96 grid place-items-center grid-cols-${cols} gap-1 p-1 bg-indigo-400 rounded-lg`}
      >
        {[...Array(cols * cols)].map((_, i) => (
          <div
            key={i + 1}
            id={(i + 1).toString()}
            onClick={handleClickOnBlock}
            className="blocks"
          />
        ))}
      </div>
    </div>
  );
}

export default App;
