import React, { useState } from 'react';
import styles from './TodoInput.module.css';

interface TodoInputProps {
  onAddTodo: (text: string, isHighPriority: boolean) => void;
}

export const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  const [inputValue, setInputValue] = useState('');
  const [isHighPriority, setIsHighPriority] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTodo(inputValue.trim(), isHighPriority);
      setInputValue('');
      setIsHighPriority(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles['todo-input-form']}>
      <div className={styles['input-row']}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a todo..."
          className={styles['todo-input']}
        />
        <button type="submit" className={styles['todo-add-button']}>
          Add
        </button>
      </div>
      <label className={styles['priority-toggle']}>
        <input
          type="checkbox"
          checked={isHighPriority}
          onChange={(e) => setIsHighPriority(e.target.checked)}
        />
        <span>High priority</span>
      </label>
    </form>
  );
};
