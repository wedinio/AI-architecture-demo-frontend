import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="bg-gray-700 text-white px-3 py-1 rounded"
    >
      {dark ? "Light" : "Dark"}
    </button>
  );
};

export default DarkModeToggle;