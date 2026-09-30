'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos on initial load
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos');
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputValue }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const newTodo = await response.json();
      setTodos([...todos, newTodo]);
      setInputValue('');
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, completed: !completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle todo');
      }

      const updatedTodo = await response.json();
      setTodos(
        todos.map(todo =>
          todo.id === id ? { ...todo, completed: updatedTodo.completed } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-sans">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Todo App
          </h1>
          <p className="text-lg text-gray-600">
            A simple full-stack todo app built with Next.js and deployed to Vercel
          </p>
        </div>

        <form onSubmit={addTodo} className="mb-8 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 min-w-0 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Adding...' : 'Add Todo'}
          </button>
        </form>

        {todos.length === 0 && !loading ? (
          <p className="text-center text-gray-500 py-12">
            No todos yet! Add one above to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between px-4 py-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id, todo.completed)}
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                  <span
                    className={`
                      flex-1 min-w-0 text-lg font-medium
                      ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}
                    `}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Built with ❤️ using Next.js API Routes •{' '}
            <a href="https://vercel.com" className="text-indigo-600 hover:underline">
              Deployed to Vercel
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}