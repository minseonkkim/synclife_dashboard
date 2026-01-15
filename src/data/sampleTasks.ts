import type { Task } from "../types/task";

export const sampleTasks: Task[] = [
  {
    id: 1,
    title: "로그인 UI 만들기",
    priority: "High",
    status: "TODO",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "칸반보드 레이아웃 구성",
    priority: "Medium",
    status: "IN_PROGRESS",
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "localStorage 연동",
    priority: "High",
    status: "TODO",
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    title: "태스크 카드 UI",
    priority: "Low",
    status: "DONE",
    createdAt: new Date().toISOString(),
  },
  {
    id: 5,
    title: "우선순위 태그 디자인",
    priority: "Medium",
    status: "DONE",
    createdAt: new Date().toISOString(),
  },
  {
    id: 6,
    title: "GitHub Pages 배포",
    priority: "High",
    status: "TODO",
    createdAt: new Date().toISOString(),
  },
  {
    id: 7,
    title: "README 작성",
    priority: "Low",
    status: "IN_PROGRESS",
    createdAt: new Date().toISOString(),
  },
  {
    id: 8,
    title: "버그 수정",
    priority: "High",
    status: "TODO",
    createdAt: new Date().toISOString(),
  },
  {
    id: 9,
    title: "반응형 확인",
    priority: "Medium",
    status: "IN_PROGRESS",
    createdAt: new Date().toISOString(),
  },
  {
    id: 10,
    title: "디자인 마무리",
    priority: "Low",
    status: "DONE",
    createdAt: new Date().toISOString(),
  },
];
