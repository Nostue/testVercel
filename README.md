# Todo App - Full Stack Next.js Application

A simple yet full-featured todo application built with Next.js 13+ featuring:
- **Frontend**: React components with useState and useEffect hooks
- **Backend**: API Routes for CRUD operations (GET, POST, PUT, DELETE)
- **Styling**: Tailwind CSS for modern, responsive design
- **Deployment**: Ready for Vercel with zero configuration

## Features

- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Persistent state during session (in-memory storage)
- Responsive design
- Loading states
- Error handling

## Architecture

### Frontend (`src/app/page.tsx`)
- Client component using React hooks
- Fetches and displays todos from API
- Handles form submission for adding todos
- Provides UI for toggling and deleting todos

### Backend (`src/app/api/todos/route.ts`)
- RESTful API routes for todo operations
- In-memory storage (replace with database for production)
- GET `/api/todos` - Retrieve all todos
- POST `/api/todos` - Create a new todo
- PUT `/api/todos` - Update a todo
- DELETE `/api/todos` - Delete a todo

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

```bash
npm run build
npm start
```

## Deploying to Vercel

The easiest way to deploy this app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

1. Push this repository to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect it's a Next.js app and deploy it
4. Your API routes will be available as serverless functions

Alternatively, you can deploy using the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Get all todos |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos` | Update a todo |
| DELETE | `/api/todos` | Delete a todo |

## Environment Variables

This app doesn't require any environment variables for basic operation. For production, you might want to add:
- Database connection string
- Any external API keys

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-supported-bundled-apis)
- [Vercel Deployment](https://vercel.com/docs)

---

Built with ❤️ using Next.js and deployed to Vercel