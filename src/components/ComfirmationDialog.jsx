import "./ConfirmationDialog.css";

export default function ConfirmationDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>注意</h2>
        <p>{message}</p>
        <button
          onClick={onConfirm}
          style={{ backgroundColor: "#0bbe47", margin: "10px" }}
        >
          确定
        </button>
        <button onClick={onCancel} style={{ backgroundColor: "#eb1f29" }}>
          取消
        </button>
      </div>
    </div>
  );
}
