import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  isLocked?: boolean;
}

// In-memory backend storage for Scratchpad notes
let backendNotes: Note[] = [
  {
    id: '1',
    title: 'Daily Memo',
    content: '- Review pull requests\n- Deploy production release\n- Update API documentation',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isLocked: false,
  },
  {
    id: '2',
    title: 'Code Snippet',
    content: 'git commit -m "feat: add scratchpad widget" && git push',
    updatedAt: 'Today',
    isLocked: false,
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Backend API Endpoints for Scratchpad Notes
  app.get('/api/notes', (req, res) => {
    res.json({ notes: backendNotes, success: true });
  });

  app.post('/api/notes', (req, res) => {
    const { notes } = req.body;
    if (Array.isArray(notes)) {
      backendNotes = notes;
      return res.json({ success: true, notes: backendNotes, message: 'Notes saved to backend successfully' });
    }
    res.status(400).json({ error: 'Invalid payload: expected notes array' });
  });

  app.put('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, isLocked, updatedAt } = req.body;
    const existingIndex = backendNotes.findIndex((n) => n.id === id);

    const updatedNote: Note = {
      id,
      title: title ?? (existingIndex >= 0 ? backendNotes[existingIndex].title : 'Untitled Note'),
      content: content ?? (existingIndex >= 0 ? backendNotes[existingIndex].content : ''),
      updatedAt: updatedAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isLocked: isLocked ?? (existingIndex >= 0 ? backendNotes[existingIndex].isLocked : false),
    };

    if (existingIndex >= 0) {
      backendNotes[existingIndex] = updatedNote;
    } else {
      backendNotes.push(updatedNote);
    }

    res.json({ success: true, note: updatedNote, notes: backendNotes });
  });

  app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    backendNotes = backendNotes.filter((n) => n.id !== id);
    res.json({ success: true, notes: backendNotes });
  });

  // Healthcheck Endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Serve Vite in Development, static dist in Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
