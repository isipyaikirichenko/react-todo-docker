import { useEffect, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'react-todo-docker';
const APP_TITLE = process.env.REACT_APP_TITLE || 'Список задач';

const FILTERS = {
  all: { label: 'Все', test: () => true },
  active: { label: 'Активные', test: (t) => !t.done },
  done: { label: 'Выполненные', test: (t) => t.done },
};

function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (e) {
    /* хранилище недоступно — начинаем с примера */
  }
  return [
    { id: 1, text: 'Написать Dockerfile', done: true },
    { id: 2, text: 'Собрать образ и запустить контейнер', done: false },
    { id: 3, text: 'Загрузить проект на GitHub', done: false },
  ];
}

function App() {
  const [todos, setTodos] = useState(loadTodos);
  const [text, setText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      /* игнорируем, если хранилище недоступно */
    }
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setTodos([...todos, { id: Date.now(), text: value, done: false }]);
    setText('');
  };

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTodo = (id) => setTodos(todos.filter((t) => t.id !== id));

  const clearDone = () => setTodos(todos.filter((t) => !t.done));

  const visible = todos.filter(FILTERS[filter].test);
  const left = todos.filter((t) => !t.done).length;

  return (
    <div className="page">
      <main className="card">
        <header>
          <h1>{APP_TITLE}</h1>
          <p className="subtitle">React + Docker (nginx) · Лабораторная работа №3</p>
        </header>

        <form className="add" onSubmit={addTodo}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Что нужно сделать?"
            aria-label="Новая задача"
          />
          <button type="submit">Добавить</button>
        </form>

        <nav className="filters">
          {Object.entries(FILTERS).map(([key, f]) => (
            <button
              key={key}
              className={filter === key ? 'active' : ''}
              onClick={() => setFilter(key)}
            >
              {f.label}
            </button>
          ))}
        </nav>

        <ul className="list">
          {visible.length === 0 && <li className="empty">Задач нет</li>}
          {visible.map((t) => (
            <li key={t.id} className={t.done ? 'done' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggleTodo(t.id)}
                />
                <span>{t.text}</span>
              </label>
              <button
                className="remove"
                onClick={() => removeTodo(t.id)}
                aria-label="Удалить задачу"
              >
                ×
              </button>
            </li>
          ))}
        </ul>

        <footer>
          <span>Осталось: {left}</span>
          <button className="link" onClick={clearDone}>
            Очистить выполненные
          </button>
        </footer>
      </main>
    </div>
  );
}

export default App;
