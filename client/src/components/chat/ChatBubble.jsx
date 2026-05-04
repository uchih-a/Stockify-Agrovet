import { Star } from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

export function ChatBubble({ isModel = false, message, onRate }) {
  const bubbleStyle = isModel
    ? {
        background: 'var(--color-primary-surface)',
        borderRadius: '16px 16px 16px 4px',
        marginRight: 'auto',
      }
    : {
        background: 'var(--color-surface-high)',
        borderRadius: '16px 16px 4px 16px',
        marginLeft: 'auto',
      };

  return (
    <div style={{ maxWidth: isModel ? '85%' : '80%' }}>
      {isModel ? (
        <div style={{ color: 'var(--color-text-hint)', fontSize: 10, marginBottom: 3 }}>AgroBot</div>
      ) : null}
      <div className={isModel ? 'grain-overlay' : undefined} style={{ ...bubbleStyle, padding: '10px 14px', position: 'relative' }}>
        <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{message.content}</div>
      </div>
      <div style={{ color: 'var(--color-text-hint)', fontSize: 10, marginTop: 4, textAlign: isModel ? 'left' : 'right' }}>
        {formatDateTime(message.createdAt)}
      </div>
      {isModel && onRate ? (
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          {Array.from({ length: 5 }).map((_, index) => (
            <button
              key={index}
              onClick={() => onRate(index + 1)}
              style={{ background: 'transparent', border: 'none', color: index + 1 <= (message.feedbackRating || 0) ? 'var(--color-amber)' : 'var(--color-text-hint)', cursor: 'pointer', padding: 0 }}
              type="button"
            >
              <Star fill="currentColor" size={12} />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default ChatBubble;
