import { neon } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

export default async function TodoPage() {
  const sql = neon(`${process.env.DATABASE_URL}`);

  // Fetch todos directly from Neon Postgres
  const todos = await sql`SELECT * FROM todos ORDER BY id DESC;`;

  // Server Action to add a todo
  async function addTodo(formData: FormData) {
    'use server';
    const text = formData.get('todo') as string;
    if (!text) return;

    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`INSERT INTO todos (text) VALUES (${text});`;
    revalidatePath('/');
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App (Synced with Postgres)</h1>
      
      <form action={addTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          name="todo"
          placeholder="What needs to be done?"
          className="border p-2 rounded flex-1 text-black"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((item: any) => (
          <li key={item.id} className="p-3 border rounded shadow-sm flex justify-between">
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}