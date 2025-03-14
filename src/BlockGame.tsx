
import { useState } from "react";
import "./blockGame.css"
function BlockGame() {

    const [level, SetLevel] = useState(1);
    const [hs, SetHs] = useState(0);
  return (
    <div className="min-w-screen min-h-screen flex justify-center items-center flex-col gap-10">
    <h1 className="text-xl md:text-5xl text-white text-center">
      Remember Number Sequence? ( Level{" "}
      <span className="italic bg-indigo-800 p-2">{level}</span> )
    </h1>
    <div className="flex justify-center items-center gap-10"><p>Your highscore is: {hs} </p>
    <button id="start-btn">Start</button>
</div>
    <div   
      className={`main-con grid grid-cols-12 grid-rows-5 gap-2 p-4 border-2 border-indigo-800`}
    >
      {[...Array(12*5)].map((_, i) => (
        <div
          key={i + 1}
          id={(i + 1).toString()}
     
          className="blocks"
        />
      ))}
    </div>
  </div>
  )
} 

export default BlockGame;