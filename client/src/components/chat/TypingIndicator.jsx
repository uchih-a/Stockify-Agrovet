export function TypingIndicator() {
  return (
    <div
      className="grain-overlay"
      style={{
        background: 'var(--color-primary-surface)',
        borderRadius: '16px 16px 16px 4px',
        display: 'inline-flex',
        gap: 6,
        marginRight: 'auto',
        padding: '10px 14px',
        position: 'relative',
      }}
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          style={{
            animation: `dot-bounce 1s ${index * 0.1}s infinite`,
            color: 'var(--color-text-primary)',
            fontSize: 14,
          }}
        >
          ●
        </span>
      ))}
    </div>
  );
}

export default TypingIndicator;
