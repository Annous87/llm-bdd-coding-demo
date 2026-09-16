import React from 'react';
import type { Todo } from '../types/Todo';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePriority: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onTogglePriority }) => {
  return (
    <div
      className={`${styles['todo-item']} ${todo.isHighPriority ? styles['high-priority-item'] : ''}`}
      data-priority={todo.isHighPriority ? 'high' : 'normal'}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className={styles['todo-checkbox']}
      />
      <span 
        className={`${styles['todo-text']} ${todo.completed ? styles['completed'] : ''}`}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onTogglePriority(todo.id)}
        className={styles['todo-priority']}
      >
        {todo.isHighPriority ? 'Remove high priority' : 'Mark high priority'}
      </button>
      <span className={styles['priority-label']}>
        {todo.isHighPriority ? 'High priority' : 'Normal priority'}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className={styles['todo-delete']}
      >
        Delete
      </button>
    </div>
  );
};
