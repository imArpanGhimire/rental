import { useEffect, useRef, useState } from 'react';

export default function DropdownMenu({ trigger, items }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className="relative inline-block" ref={rootRef}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        {trigger}
      </div>

      {open && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-xl border border-stone bg-bg shadow-[0_8px_24px_rgba(20,20,26,0.12)] py-1.5 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setOpen(false);
                item.onSelect?.();
              }}
              className={`w-full text-left px-3.5 py-2 text-sm flex items-center gap-2 hover:bg-ivory transition-colors ${
                item.danger ? 'text-red-600' : 'text-text'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
