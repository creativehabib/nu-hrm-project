export default function ConfirmDeleteModal({
  title,
  description,
  confirmText = "হ্যাঁ, মুছুন",
  cancelText = "না, বাতিল",
  onConfirm,
  onCancel
}) {
  return (
    <div className="modal-overlay" role="presentation">
      <div className="modal card" role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
        </header>
        <div className="inline-actions">
          <button className="button danger" type="button" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="button secondary" type="button" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
