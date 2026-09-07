import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  function handleChange(event) {
    const newValue = event.target.value;

    setValue(newValue);
    onSearch(newValue);
  }

  function handleClear() {
    setValue("");
    onSearch("");
  }

  return (
    <div className="relative">
      <label htmlFor="entry-search" className="sr-only">
        Search entries
      </label>

      <input
        id="entry-search"
        type="search"
        value={value}
        onChange={handleChange}
        placeholder="Search entries..."
        className="w-full rounded-lg border border-secondary-100 bg-background px-4 py-3 pr-24 outline-none focus:border-primary-500"
      />

      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-sm font-medium text-secondary-700 hover:bg-secondary-100"
        >
          Clear
        </button>
      )}
    </div>
  );
}
