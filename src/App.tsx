import { useEffect, useState } from 'react';
import type { Todo } from './types/Todo';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

type TodoFilter = 'all' | 'active' | 'completed';
type TodoView = 'main' | 'archived';

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('simple-todo-items', []);
  const [selectedFilter, setSelectedFilter] = useState<TodoFilter>('all');
  const [selectedView, setSelectedView] = useState<TodoView>('main');

  const normalizedTodos = todos.map((todo) => ({
    ...todo,
    isHighPriority: todo.isHighPriority ?? false,
    archived: todo.archived ?? false,
  }));

  useEffect(() => {
    if (selectedView === 'archived' && !normalizedTodos.some((todo) => todo.archived)) {
      setSelectedView('main');
    }
  }, [normalizedTodos, selectedView]);

  const sortedMainTodos = normalizedTodos.filter((todo) => !todo.archived).sort((a, b) => {
    if (a.isHighPriority === b.isHighPriority) {
      return a.createdAt - b.createdAt;
    }

    return a.isHighPriority ? -1 : 1;
  });

  const sortedArchivedTodos = normalizedTodos.filter((todo) => todo.archived).sort((a, b) => {
    if (a.isHighPriority === b.isHighPriority) {
      return a.createdAt - b.createdAt;
    }

    return a.isHighPriority ? -1 : 1;
  });

  const filteredMainTodos = sortedMainTodos.filter((todo) => {
    if (selectedFilter === 'active') {
      return !todo.completed;
    }

    if (selectedFilter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const visibleTodos = selectedView === 'archived' ? sortedArchivedTodos : filteredMainTodos;

  const hasCompletedTodos = sortedMainTodos.some((todo) => todo.completed);
  const hasArchivedTodos = sortedArchivedTodos.length > 0;

  const addTodo = (text: string, isHighPriority: boolean) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      isHighPriority,
      archived: false,
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

  const duplicateTodo = (id: string) => {
    const source = normalizedTodos.find((todo) => todo.id === id);

    if (!source) {
      return;
    }

    const earliestCreatedAt = normalizedTodos.reduce(
      (earliest, todo) => Math.min(earliest, todo.createdAt),
      Date.now()
    );

    const duplicatedTodo: Todo = {
      ...source,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: earliestCreatedAt - 1,
    };

    setTodos([...normalizedTodos, duplicatedTodo]);
  };

  const deleteTodo = (id: string) => {
    setTodos(normalizedTodos.filter(todo => todo.id !== id));
  };

  const clearCompletedTodos = () => {
    setTodos(normalizedTodos.filter((todo) => !todo.completed));
  };

  const archiveCompletedTodos = () => {
    setTodos(
      normalizedTodos.map((todo) =>
        todo.archived || !todo.completed ? todo : { ...todo, archived: true }
      )
    );
    setSelectedView('main');
    setSelectedFilter('all');
  };

  return (
    <div className="app">
      <h1>Simple Todo App</h1>
      <TodoInput onAddTodo={addTodo} />
      <div className="view-controls" role="group" aria-label="Todo list views">
        <button
          type="button"
          className={`view-button ${selectedView === 'main' ? 'view-button-active' : ''}`}
          aria-pressed={selectedView === 'main'}
          onClick={() => setSelectedView('main')}
        >
          Main todos
        </button>
        {hasArchivedTodos && (
          <button
            type="button"
            className={`view-button ${selectedView === 'archived' ? 'view-button-active' : ''}`}
            aria-pressed={selectedView === 'archived'}
            onClick={() => setSelectedView('archived')}
          >
            Archived todos
          </button>
        )}
      </div>
      <div className="todo-actions">
        {selectedView === 'main' ? (
          <>
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
            <div className="bulk-actions">
              {hasCompletedTodos && (
                <button type="button" className="archive-completed-button" onClick={archiveCompletedTodos}>
                  Archive completed
                </button>
              )}
              {hasCompletedTodos && (
                <button type="button" className="clear-completed-button" onClick={clearCompletedTodos}>
                  Clear completed
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="archived-caption">Showing archived todos</p>
        )}
      </div>
      <TodoList
        todos={visibleTodos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
        onTogglePriority={togglePriority}
        onDuplicateTodo={duplicateTodo}
      />
    </div>
  );
}

export default App;
