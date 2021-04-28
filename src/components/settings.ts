import { TaskListView as TaskListColumns } from "../types/app";

export enum Roles {
  Operator = "Оператор",
  Manager = "Менеджер",
  Worker = "Исполнитель",
  Administrator = "Администратор",
}

const fullView = {
  columns: {
    taskId: "Номер",
    subject: "Тема",
    createDate: "Дата создания",
    authorName: "Автор",
    updateDate: "Дата редактирования",
    editorName: "Редактор",
    statusName: "Статус",
    commentCount: "Кол-во комментариев",
  },
};

const shortView = {
  width: "500px",
  columns: {
    taskId: "Номер",
    subject: "Тема",
    statusName: "Статус",
  },
};

export const getViewSettings = (
  role: string
): { width?: string; columns: TaskListColumns } => {
  return role === Roles.Administrator ? fullView : shortView;
};

export const api = "https://localhost:5001/api/Worktasks";
