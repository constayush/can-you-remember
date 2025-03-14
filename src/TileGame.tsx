import { useState, useEffect, useRef } from "react";
import "./index.css";

function TileGame() {
  const [level, setLevel] = useState(1);
  const [randomArr, setRandomArr] = useState<number[]>([]);
  const [userInputArr, setUserInputArr] = useState<number[]>([]);
  const [blockIsClickable, setBlockIsClickable] = useState(true);
  const [highscore, setHighscore] = useState(0);
  const gridRef = useRef(null);
  const [cols, setCols] = useState(3);
  const generate_rn = () => Math.floor(Math.random() * (cols * cols)) + 1;
  const [clickCount, setClickCount] = useState(0);
  const loseAudio = new Audio(`../public/sfx/roundlose.mp3`);
  const soundEffects = useRef<{ [key: number]: HTMLAudioElement }>({});

  useEffect(() => {
    for (let i = 1; i <= 12; i++) {
      soundEffects.current[i] = new Audio(`/sfx/${i}.mp3`);
      soundEffects.current[i].load(); // Preload sounds
    }
  }, []);

  const handleClickOnBlock = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!blockIsClickable) {
      console.log("Not clickable while animating");
      return;
    }
    const target = e.target as HTMLDivElement;
    if (!target || !target.id) {
      console.error("Invalid target or missing id");
      return;
    }

    const tileId = Number(target.id);

    // Cycle through 12 sounds
    let soundIndex = ((tileId - 1) % 12) + 1;

    // Get preloaded audio
    const audio = soundEffects.current[soundIndex];

    if (audio) {
      audio.currentTime = 0; // Restart from the beginning
      audio.playbackRate = 1 + clickCount * 0.05; // Increase pitch gradually
      audio.play();
    } else {
      console.error(`Audio file /sfx/${soundIndex}.mp3 not found!`);
    }

    setClickCount((prev) => prev + 1);

    // Flash animation
    target.classList.add("flash");
    setTimeout(() => {
      if (document.body.contains(target)) {
        target.classList.remove("flash");
      }
    }, 500);

    setUserInputArr((prev) => [...prev, tileId]);
  };

  // handle clicks on blocks

  const handleClickOnStartBtn = async () => {
    const optionsElement = document.getElementById(
      "options"
    ) as HTMLElement | null;
    if (optionsElement) {
      optionsElement.style.display = "none";
    }
    setRandomArr([]);
    setUserInputArr([]);
    setBlockIsClickable(false);
    await animateRandomTiles();
    setBlockIsClickable(true);
  }; //handle start btn
  //   if (!blockIsClickable) {
  //     console.log("Not clickable while animating");
  //     return;
  //   }

  //   const target = e.target as HTMLDivElement;

  //   if (!target || !target.id) {
  //     console.error("Invalid target or missing id");
  //     return;
  //   }
  //   const { id } = target;

  //   // add sfx

  //   const audio = soundEffects.current[id];

  //   if (audio) {
  //     audio.currentTime = 0;
  //     audio.play();
  //   }
  //   target.classList.add("flash");
  //   setTimeout(() => {

  //     if (document.body.contains(target)) {
  //       target.classList.remove("flash");
  //     }
  //   }, 500);

  //   setUserInputArr((prev) => [...prev, Number(id)]);
  // };

  useEffect(() => {
    if (userInputArr.length === randomArr.length && randomArr.length > 0) {
      if (userInputArr.join() === randomArr.join()) {
        roundOver(true);
        setTimeout(async () => {
          setBlockIsClickable(false);
          await animatePrevTiles();
          await animateRandomTiles();
          setBlockIsClickable(true);
        }, 2000);
      } else {
        setBlockIsClickable(false);
        loseAudio.play();
        roundOver(false);
        setLevel(1);
        setRandomArr([]);
        setUserInputArr([]);
        const btn = document.getElementById("options");
        if (btn) btn.style.display = "block";
      }
    }
  }, [userInputArr]); // decide if win or lose

  const animatePrevTiles = async (): Promise<void> => {
    setUserInputArr([]);
    for (const rn of randomArr) {
      const tile = document.getElementById(rn.toString());
      if (tile) {
        tile.classList.add("flash");
        await new Promise((resolve) =>
          setTimeout(() => {
            tile.classList.remove("flash");
            resolve("finish animating");
          }, 600)
        );
      }
    }
  }; // animate previous tiles

  const animateRandomTiles = async () => {
    return new Promise<void>((resolve) => {
      let rn: number = generate_rn();

      if (rn === randomArr[randomArr.length - 1]) rn = generate_rn();
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
  }; // animate random tiles

  const roundOver = (isWin: boolean) => {
    const animationClass = isWin ? "win-animate" : "lose-animate";

    if (level > highscore) {
      setHighscore(level);
    }

    setLevel((prev) => prev + 1);
    setTimeout(() => {
      randomArr.forEach((e) => {
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
  }; // handle common round over logic

  return (
    <div className=" min-w-screen p-6 md:p-12 lg:min-h-screen flex flex-col lg:flex-row justify-around items-center gap-10 lg:gap-10">
      <aside className=" w-full  lg:max-w-[30%] z-99 flex flex-col text-center gap-4">
        <h1 className="text-xl md:text-6xl text-white text-center">
          Remember Tiles Sequence? <br />
        </h1>
        <p className="text-3xl">
          {" "}
          ( Level <span className="italic bg-indigo-800 p-2">{level}</span> )
        </p>
        <p>Your highscore is {highscore} </p>
        <div
          className="flex flex-col  gap-4 justify-center"
          id="options"
        >
          <div className="w-full flex justify-center">
            <button className="op-button" onClick={() => setCols(3)}>
              3x3
            </button>
            <button className="op-button" onClick={() => setCols(4)}>
              4x4
            </button>
            <button className="op-button" onClick={() => setCols(5)}>
              5x5
            </button>
          </div>
          <button
            id="start-btn"
            onClick={handleClickOnStartBtn}
            className="border-3 text-3xl  cursor-pointer bg-indigo-500 p-4 rounded-lg"
          >
            Start
          </button>
        </div>
      </aside>

      {/* grid-cols-3
    grid-cols-4
    grid-cols-5
  */}

      <div className=" w-full lg:min-w-[55rem]">
        <div
          ref={gridRef}
          className={`   grid w-full h-auto place-items-center grid-cols-${cols} gap-3 p-3 bg-indigo-400 rounded-lg`}
        >
          {[...Array(cols * cols)].map((_, i) => (
            <div
              key={i + 1}
              id={(i + 1).toString()}
              onClick={handleClickOnBlock}
              className="blocks p-10 m-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TileGame;
