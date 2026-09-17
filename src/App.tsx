import { useState } from 'react';
import type { Todo } from './types/Todo';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

type TodoFilter = 'all' | 'active' | 'completed';

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('simple-todo-items', []);
  const [selectedFilter, setSelectedFilter] = useState<TodoFilter>('all');

  const normalizedTodos = todos.map((todo) => ({
    ...todo,
    isHighPriority: todo.isHighPriority ?? false,
  }));

  const sortedTodos = [...normalizedTodos].sort((a, b) => {
    if (a.isHighPriority === b.isHighPriority) {
      return a.createdAt - b.createdAt;
    }

    return a.isHighPriority ? -1 : 1;
  });

  const visibleTodos = sortedTodos.filter((todo) => {
    if (selectedFilter === 'active') {
      return !todo.completed;
    }

    if (selectedFilter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const addTodo = (text: string, isHighPriority: boolean) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      isHighPriority,
    };
    setTodos([...normalizedTodos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(normalizedTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const togglePriority = (id: string) => {
    setTodos(normalizedTodos.map(todo =>
      todo.id === id ? { ...todo, isHighPriority: !todo.isHighPriority } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(normalizedTodos.filter(todo => todo.id !== id));
  };

  return (
    <div className="app">
      <h1>Simple Todo App</h1>
      <TodoInput onAddTodo={addTodo} />
      <div className="filter-controls" role="group" aria-label="Todo status filters">
        <button
          type="button"
          className={`filter-button ${selectedFilter === 'all' ? 'filter-button-active' : ''}`}
          aria-pressed={selectedFilter === 'all'}
          onClick={() => setSelectedFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          className={`filter-button ${selectedFilter === 'active' ? 'filter-button-active' : ''}`}
          aria-pressed={selectedFilter === 'active'}
          onClick={() => setSelectedFilter('active')}
        >
          Active
        </button>
        <button
          type="button"
          className={`filter-button ${selectedFilter === 'completed' ? 'filter-button-active' : ''}`}
          aria-pressed={selectedFilter === 'completed'}
          onClick={() => setSelectedFilter('completed')}
        >
          Completed
        </button>
      </div>
      <TodoList
        todos={visibleTodos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
        onTogglePriority={togglePriority}
      />
    </div>
  );
}

export default App;
