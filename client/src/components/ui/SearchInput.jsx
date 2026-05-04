import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function SearchInput({
  onChange,
  onClear,
  placeholder = 'Search...',
  value = '',
  ...rest
}) {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(internalValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [internalValue, onChange]);

  return (
    <Input
      {...rest}
      placeholder={placeholder}
      prefix={<Search size={16} />}
      suffix={
        internalValue ? (
          <Button
            aria-label="Clear search"
            onClick={() => {
              setInternalValue('');
              onClear?.();
            }}
            size="sm"
            style={{ paddingInline: 0 }}
            type="button"
            variant="tertiary"
          >
            <X size={14} />
          </Button>
        ) : null
      }
      value={internalValue}
      onChange={(event) => setInternalValue(event.target.value)}
    />
  );
}

export default SearchInput;
