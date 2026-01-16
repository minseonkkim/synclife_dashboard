const Header = ({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => (
  <header className="w-full bg-white dark:bg-gray-900 px-4 py-2 flex justify-between items-center">
    <h1 className="text-xl font-bold text-black dark:text-white">
      Kanban Board
    </h1>
    <button
      onClick={toggleDarkMode}
      className="
    p-2 rounded-full border
    hover:bg-gray-200 dark:hover:bg-gray-800
    dark:border-gray-700 dark:text-white
    transition
  "
      aria-label="Toggle dark mode"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  </header>
);

export default Header;
