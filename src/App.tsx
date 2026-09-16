import type { Todo } from './types/Todo';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { useLocalStorage } from './hooks/useLocalStorage';
import './App.css';

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('simple-todo-items', []);

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
      <TodoList
        todos={sortedTodos}
        onToggleTodo={toggleTodo}
        onDeleteTodo={deleteTodo}
        onTogglePriority={togglePriority}
      />
    </div>
  );
}

export default App;
