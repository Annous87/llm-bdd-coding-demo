export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  isHighPriority: boolean;
  archived?: boolean;
}
