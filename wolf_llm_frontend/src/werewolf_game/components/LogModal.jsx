// // src/demo_novel_game/components/LogModal.jsx
// import "./LogModal.css";

// export default function LogModal({ log, onClose }) {
//     return (
//       <div className="modal-backdrop">
//         <div className="modal scrollable">
//           <h2>テキストログ</h2>
//           <ul className="log-list">
//             {log.map((l, i) => (
//               <li key={i}>
//                 <strong>{l.Speaker}</strong>：{l.Text}
//               </li>
//             ))}
//           </ul>
//           <button onClick={onClose}>閉じる</button>
//         </div>
//       </div>
//     );
//   }
  
  // src/demo_novel_game/components/LogModal.jsx
import React from "react";
import ReactDOM from "react-dom";
import "./LogModal.css";

function LogModalContent({ log, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>テキストログ</h2>
        <ul className="log-list">
          {log.map((l, i) => (
            <li key={i}>
              <strong>{l.Speaker}</strong>：{l.Text}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>閉じる</button>
      </div>
    </div>
  );
}

export default function LogModal(props) {
  return ReactDOM.createPortal(
    <LogModalContent {...props} />,
    document.body
  );
}
