import { useState, useRef, useEffect } from "react";

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}

const InlineEdit = ({ value, onSave, className = "", placeholder = "Click to edit", multiline = false }: InlineEditProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) {
      onSave(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setDraft(value);
      setEditing(false);
    }
  };

  if (!editing) {
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
        className={`cursor-text hover:bg-accent/60 px-1 -mx-1 rounded transition-colors ${className} ${!value ? "text-muted-foreground/50 italic" : ""}`}
      >
        {value || placeholder}
      </span>
    );
  }

  const sharedProps = {
    value: draft,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
    onBlur: handleSave,
    onKeyDown: handleKeyDown,
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    className: `bg-background border border-ring px-1.5 py-0.5 -mx-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring ${className}`,
    placeholder,
  };

  if (multiline) {
    return <textarea ref={inputRef as any} rows={2} {...sharedProps} />;
  }

  return <input ref={inputRef as any} type="text" {...sharedProps} />;
};

export default InlineEdit;
