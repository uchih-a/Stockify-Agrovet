const spinnerSizes = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 36,
  xl: 48,
};

export function Spinner({ size = 'md', className = '', ...rest }) {
  const dimension = spinnerSizes[size] || spinnerSizes.md;

  return (
    <svg
      viewBox="0 0 50 50"
      width={dimension}
      height={dimension}
      className={className}
      aria-hidden="true"
      style={{ animation: 'spin 700ms linear infinite' }}
      {...rest}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="4"
      />
      <path
        d="M45 25A20 20 0 0 0 25 5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

export default Spinner;
