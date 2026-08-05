export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40">
      <div className="w-full max-w-md bg-bg text-text border border-stone shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h3 className="font-display text-lg text-text">{title}</h3>
          )}
          <button
            onClick={onClose}
            className="text-text/60 hover:text-text text-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
