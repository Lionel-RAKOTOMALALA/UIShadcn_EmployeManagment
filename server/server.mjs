import express from 'express';
import cors from 'cors';
import employeeRoutes from './routes/employees.mjs';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 