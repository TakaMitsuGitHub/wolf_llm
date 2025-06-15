// import React, {useState, useEffect, useRef, useCallback } from "react";
// import "./WerewolfEngine.css";
// import { API_BASE } from "../../common/api";
// import SaveLoadModal from "./SaveLoadModal";
// import LogModal from "./LogModal";
// import * as saveManager from "../save/saveManagerApi";

// export default function WerewolfEngine({ initialSave = null }) {

//   const gameRef = useRef(null);
//   const [fontScale, setFontScale] = useState(1);

//   useEffect(() => {
//     const onResize = () => {
//       if (gameRef.current) {
//         setFontScale(gameRef.current.offsetWidth / 1280);
//       }
//     };
//     window.addEventListener("resize", onResize);
//     onResize();
//     return () => window.removeEventListener("resize", onResize)
//   }, []);

//   return (
//     <div className="novel-container">
//       <div
//         className="game-window"
//         ref={gameRef}
//         >

//         </div>
//     </div>
//   )
// }