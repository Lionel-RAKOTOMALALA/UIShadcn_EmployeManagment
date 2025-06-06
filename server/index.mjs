import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employees.mjs';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur est survenue sur le serveur' });
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});