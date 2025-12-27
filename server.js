const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
require('dotenv').config();
// Serve frontend files
const path = require('path');
app.use(express.static(path.join(__dirname, '../panel-ui')));

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../panel-ui/dashboard.html'));
});

app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);
app.use('/project', projectRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

server.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
