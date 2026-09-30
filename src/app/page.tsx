import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default async function TodoPage() {
  const dbUrl = process.env.DATABASE_URL;

  let todos: Todo[] = [];
  if (dbUrl) {
    const sql = neon(dbUrl);
    todos = (await sql`SELECT * FROM todos ORDER BY id DESC;`) as Todo[];
  }

  async function addTodo(formData: FormData) {
    'use server';
    const text = formData.get('todo') as string;
    if (!text || !process.env.DATABASE_URL) return;

    const sql = neon(process.env.DATABASE_URL);
    await sql`INSERT INTO todos (text) VALUES (${text});`;
    revalidatePath('/');
  }

  async function toggleTodo(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (!id || !process.env.DATABASE_URL) return;

    const sql = neon(process.env.DATABASE_URL);
    // Get current todo to toggle completed
    const todo = (await sql`SELECT * FROM todos WHERE id = ${id};`)[0];
    if (!todo) return;

    await sql`UPDATE todos SET completed = NOT ${todo.completed} WHERE id = ${id};`;
    revalidatePath('/');
  }

  async function deleteTodo(formData: FormData) {
    'use server';
    const id = formData.get('id') as string;
    if (!id || !process.env.DATABASE_URL) return;

    const sql = neon(process.env.DATABASE_URL);
    await sql`DELETE FROM todos WHERE id = ${id};`;
    revalidatePath('/');
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 py-12 px-4 sm:px-6">
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Todo App
        </h1>

        <form action={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            name="todo"
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition active:scale-95 shadow-sm"
          >
            Add
          </button>
        </form>

        <ul className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">
              No tasks yet. Add one above!
            </p>
          ) : (
            todos.map((item: Todo) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <form action={toggleTodo} className="flex items-center gap-2">
                    <input
                      type="hidden"
                      name="id"
                      value={item.id}
                    />
                    <input
                      type="checkbox"
                      checked={item.completed}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </form>
                  <span className={`
                    flex-1 min-w-0 text-lg font-medium
                    ${item.completed ? 'line-through text-gray-400' : 'text-gray-800'}
                  `}>
                    {item.text}
                  </span>
                </div>
                <form action={deleteTodo} className="ml-2">
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </form>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}