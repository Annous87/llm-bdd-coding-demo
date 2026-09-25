import React from 'react';
import type { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import styles from './TodoList.module.css';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onTogglePriority: (id: string) => void;
  onDuplicateTodo: (id: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onTogglePriority,
  onDuplicateTodo,
}) => {
  if (todos.length === 0) {
    return (
      <div className={styles['empty-state']}>
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className={styles['todo-list']}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          onTogglePriority={onTogglePriority}
          onDuplicate={onDuplicateTodo}
        />
      ))}
    </div>
  );
};
