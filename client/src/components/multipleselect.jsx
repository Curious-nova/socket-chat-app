import React from "react";
import { X } from "lucide-react";

const MultipleSelector = ({
  className = "",
  defaultOptions = [],
  placeholder = "Select items...",
  value = [],
  onChange,
  emptyIndicator = null,
}) => {
  const inputRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleUnselect = (item) => {
    const updated = value.filter((v) => v.value !== item.value);
    onChange(updated);
  };

  const handleKeyDown = (e) => {
    if (inputRef.current) {
      if ((e.key === "Delete" || e.key === "Backspace") && !inputValue) {
        const updated = [...value];
        updated.pop();
        onChange(updated);
      } else if (e.key === "Escape") {
        inputRef.current.blur();
        setOpen(false);
      }
    }
  };

  const selectables = defaultOptions.filter(
    (option) =>
      !value.some((v) => v.value === option.value) &&
      option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <div className={`relative w-full max-w-xl ${className}`} onKeyDown={handleKeyDown}>
      <div className="w-full">
        <div className="rounded-md p-2  text-white">
          <div className="flex flex-wrap gap-2">
            {value.map((item) => (
              <span
                key={item.value}
                className="inline-flex items-center px-2 py-1 rounded-md bg-gray-700 text-sm text-white"
              >
                {item.label}
                <button
                  className="ml-1 rounded-full hover:bg-gray-600 p-0.5"
                  onClick={() => handleUnselect(item)}
                >
                  <X className="h-3 w-3 text-gray-300" />
                </button>
              </span>
            ))}
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
              placeholder={placeholder}
              className="flex-1 bg-transparent outline-none text-sm text-white min-w-[120px]"
            />
          </div>
        </div>
        {open && (
          <ul
            role="listbox"
            className="absolute w-full mt-2 rounded-md border bg-gray-800 shadow-lg z-50 text-white"
          >
            {selectables.length > 0 ? (
              selectables.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 hover:text-white"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onChange([...value, option]);
                    setInputValue("");
                  }}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-400">{emptyIndicator}</li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MultipleSelector;
