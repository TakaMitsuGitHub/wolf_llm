// import React, { useRef, useEffect, useState } from "react";
// import werewolfBg from "../../assets/images/werewolf_menu_bg.png";
// import "./MenuScreen.css";

// function MenuScreen({ onNewGame, onContinue }) {
//   const gameRef = useRef(null);
//   const [fontScale, setFontScale] = useState(1);

//   useEffect(() => {
//     const handleResize = () => {
//       if (gameRef.current) {
//         setFontScale(gameRef.current.offsetWidth / 1280);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     handleResize();
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="werewolf-menu-container">
//       <div
//         className="werewolf-game-window"
//         ref={gameRef}
//         style={{
//           "--font-scale": fontScale,
//           backgroundImage: `url(${werewolfBg})`,
//         }}
//       >
//         <div className="werewolf-menu-box">
//           <h1 className="werewolf-menu-title">人狼ゲーム</h1>
//           <button className="werewolf-menu-button" onClick={onNewGame}>
//             ニューゲーム
//           </button>
//           <button className="werewolf-menu-button" onClick={onContinue}>
//             コンティニュー
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MenuScreen;
