import { NextResponse } from 'next/server';

// In-memory storage for todos (in a real app, you'd use a database)
let todos = [
  { id: 1, text: 'Learn Next.js', completed: true },
  { id: 2, text: 'Build a todo app', completed: false },
  { id: 3, text: 'Deploy to Vercel', completed: false }
];
let nextId = 4;

// GET /api/todos - Retrieve all todos
export async function GET() {
  return NextResponse.json(todos);
}

// POST /api/todos - Create a new todo
export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const newTodo = {
      id: nextId++,
      text: text.trim(),
      completed: false
    };

    todos.push(newTodo);
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// PUT /api/todos/:id - Update a todo
export async function PUT(request: Request) {
  try {
    const { id, text, completed } = await request.json();

    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    if (text !== undefined) {
      todos[todoIndex].text = text;
    }
    if (completed !== undefined) {
      todos[todoIndex].completed = completed;
    }

    return NextResponse.json(todos[todoIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

// DELETE /api/todos/:id - Delete a todo
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    const deletedTodo = todos.splice(todoIndex, 1)[0];
    return NextResponse.json(deletedTodo);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}