import { Send } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function ChatInput({ disabled, onChange, onSubmit, value }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 84)}px`;
  }, [value]);

  return (
    <div style={{ alignItems: 'flex-end', background: 'var(--color-surface)', borderTop: '1px solid rgba(67,72,62,0.08)', display: 'flex', gap: 12, padding: 12 }}>
      <div style={{ flex: 1 }}>
        <textarea
          ref={textareaRef}
          disabled={disabled}
          onChange={(event) => onChange?.(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              onSubmit?.();
            }
          }}
          placeholder="Ask about crops, livestock..."
          rows={1}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-primary)',
            fontSize: 13,
            maxHeight: 84,
            outline: 'none',
            resize: 'none',
            width: '100%',
          }}
          value={value}
        />
        {value.length > 800 ? (
          <div style={{ color: 'var(--color-text-hint)', fontSize: 11, marginTop: 4 }}>{value.length}/1000</div>
        ) : null}
      </div>
      <button
        disabled={disabled || !value.trim()}
        onClick={() => onSubmit?.()}
        style={{
          alignItems: 'center',
          background: 'var(--color-primary)',
          border: 'none',
          borderRadius: '9999px',
          color: '#fff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          height: 36,
          justifyContent: 'center',
          opacity: disabled ? 0.7 : 1,
          width: 36,
        }}
        type="button"
      >
        <Send size={16} />
      </button>
    </div>
  );
}

export default ChatInput;
