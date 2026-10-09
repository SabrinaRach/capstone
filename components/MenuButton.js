import { useEffect, useId, useRef, useState } from "react";

// A button that opens a list of choices, following the WAI-ARIA menu button
// pattern: the current choice is a checked menuitemradio, arrow keys / Home /
// End move between the choices, Escape closes the menu and focus returns to
// the button.
export default function MenuButton({
  label,
  buttonContent,
  buttonClassName,
  menuLabel,
  menuClassName = "w-40",
  options,
  value,
  onSelect,
}) {
  const menuId = useId();
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === value),
    0,
  );
  const [focusedIndex, setFocusedIndex] = useState(selectedIndex);

  useEffect(() => {
    if (isOpen) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [isOpen, focusedIndex]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleClickOutside(event) {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  function open(index = selectedIndex) {
    setFocusedIndex(index);
    setIsOpen(true);
  }

  function close({ returnFocus = true } = {}) {
    setIsOpen(false);

    if (returnFocus) {
      buttonRef.current?.focus();
    }
  }

  function handleButtonKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      open(selectedIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      open(options.length - 1);
    }
  }

  function handleMenuKeyDown(event) {
    const last = options.length - 1;
    const moves = {
      ArrowDown: focusedIndex === last ? 0 : focusedIndex + 1,
      ArrowUp: focusedIndex === 0 ? last : focusedIndex - 1,
      Home: 0,
      End: last,
    };

    if (event.key in moves) {
      event.preventDefault();
      setFocusedIndex(moves[event.key]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab") {
      close({ returnFocus: false });
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleButtonKeyDown}
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        className={buttonClassName}
      >
        {buttonContent}
      </button>

      {isOpen && (
        <ul
          id={menuId}
          role="menu"
          aria-label={menuLabel}
          onKeyDown={handleMenuKeyDown}
          className={`absolute right-0 mt-2 overflow-hidden rounded-xl border border-secondary-100/80 bg-background/95 shadow-lg backdrop-blur-md ${menuClassName}`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const Icon = option.icon;

            return (
              <li key={option.value} role="none">
                <button
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isSelected}
                  tabIndex={index === focusedIndex ? 0 : -1}
                  lang={option.lang}
                  onClick={() => {
                    onSelect(option.value);
                    close();
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-primary-500/10 ${
                    isSelected
                      ? "font-semibold text-primary-500"
                      : "text-foreground"
                  }`}
                >
                  {Icon && <Icon size={16} strokeWidth={1.8} aria-hidden="true" />}
                  <span className="flex-1">{option.label}</span>
                  {isSelected && <span aria-hidden="true">✓</span>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
