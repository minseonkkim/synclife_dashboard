import type { Priority, Task } from "../types/task";

interface Props {
  searchKeyword: string;
  setSearchKeyword: (v: string) => void;
  setDebouncedKeyword: (v: string) => void;

  priorityFilter: Priority | "ALL";
  setPriorityFilter: (v: Priority | "ALL") => void;

  statusFilter: Task["status"] | "ALL";
  setStatusFilter: (v: Task["status"] | "ALL") => void;

  recentKeywords: string[];
  setRecentKeywords: React.Dispatch<React.SetStateAction<string[]>>;

  sortKey: "DATE" | "PRIORITY";
  sortOrder: "ASC" | "DESC";
  setSortKey: (v: "DATE" | "PRIORITY") => void;
  setSortOrder: (v: "ASC" | "DESC") => void;
}

const BoardControls = ({
  searchKeyword,
  setSearchKeyword,
  setDebouncedKeyword,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  setRecentKeywords,
  sortKey,
  sortOrder,
  setSortKey,
  setSortOrder,
}: Props) => {
  const saveRecentKeyword = (keyword: string) => {
    if (!keyword.trim()) return;

    setRecentKeywords((prev) => {
      const updated = [keyword, ...prev.filter((k) => k !== keyword)].slice(
        0,
        5
      );
      localStorage.setItem("recent_keywords", JSON.stringify(updated));
      return updated;
    });
  };

  const resetAll = () => {
    setSearchKeyword("");
    setDebouncedKeyword("");
    setPriorityFilter("ALL");
    setStatusFilter("ALL");
  };

  const toggleSort = (key: "DATE" | "PRIORITY") => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");
    } else {
      setSortKey(key);
      setSortOrder("DESC");
    }
  };

  const arrow = (key: "DATE" | "PRIORITY") =>
    sortKey === key ? (sortOrder === "DESC" ? "↓" : "↑") : "";

  const selectClass =
    "h-10 px-3 rounded-md bg-white dark:bg-gray-900 " +
    "border border-gray-300 dark:border-gray-700 " +
    "text-sm text-gray-900 dark:text-gray-100 w-full";

  return (
    <div className="mb-6 shadow-sm flex flex-col gap-3 p-2">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
        {/* 검색 */}
        <input
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && saveRecentKeyword(searchKeyword)
          }
          onBlur={() => saveRecentKeyword(searchKeyword)}
          placeholder="Task 제목 검색"
          className="flex-1 min-w-[200px] h-10 px-4 rounded-md
                     bg-white dark:bg-gray-900
                     border border-gray-300 dark:border-gray-700
                     text-gray-900 dark:text-gray-100
                     placeholder-gray-400"
        />

        <div className="flex gap-3">
          {/* 우선순위 필터 */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className={selectClass}
          >
            <option value="ALL">우선순위</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* 상태 필터 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className={selectClass}
          >
            <option value="ALL">상태</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          {/* 초기화 */}
          {(searchKeyword ||
            priorityFilter !== "ALL" ||
            statusFilter !== "ALL") && (
            <button
              onClick={resetAll}
              className="h-10 px-3 text-sm rounded-md whitespace-nowrap
                       border border-gray-300 dark:border-gray-700
                       bg-white dark:bg-gray-900
                       hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      {/* 정렬 버튼 */}
      <div className="flex gap-5 text-sm justify-end text-gray-700 dark:text-gray-300">
        <button onClick={() => toggleSort("DATE")}>
          날짜순 {arrow("DATE")}
        </button>

        <button onClick={() => toggleSort("PRIORITY")}>
          우선순위순 {arrow("PRIORITY")}
        </button>
      </div>
    </div>
  );
};

export default BoardControls;
