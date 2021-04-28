type User = {
  id: string;
  name?: string;
  role: string;
  canCreate: boolean;
};

type TaskComment = {
  id?: string;
  text: string;
  authorId: string;
  authorName?: string;
  createDate?: string;
  taskId: string;
};

export type TaskData = {
  taskId: string;
  subject: string;
  text: string;
  authorId: string;
  authorName?: string;
  editorId?: string;
  editorName?: string;
  statusId?: string;
  statusName: string;
  comments?: TaskComment[];
  canBeDeleted?: boolean;
  canBeEdited?: boolean;
  canTransitToStatuses?: {
    status: string;
    needComment: boolean;
  }[];
  comments?: TaskComment[];
};

export type TaskListView = {
  taskId: string;
  subject: string;
  authorName?: string;
  createDate?: string;
  editorName?: string;
  updateDate?: string;
  statusName: string;
  commentCount?: string;
};

export type AppState = {
  user?: User;
  isEditing: boolean;
  editedTaskId?: string;
  needRefresh?: boolean;
};
