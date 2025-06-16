import "./LogModal.css";

export default function LogModal({ log, onClose }) {
    return (
      <div className="modal-backdrop">
        <div className="modal scrollable">
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
  