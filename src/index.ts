import express from 'express';

import playerRoutes from './routes/players';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.use('/players', playerRoutes);

app.get('/', (req, res) => {
  res.send('Fantasy Soccer Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
