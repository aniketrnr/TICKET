// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const app = express();
// //const PORT = 3002;

// app.use(express.json());
// app.use(cors());

// mongoose.connect('mongodb://127.0.0.1:27017/ticketingSystem', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(3002, () => {
//       console.log("Server is running");
//     });
//   })
//   .catch(error => {
//     console.error("Error connecting to MongoDB:", error);
//   });

// const ticketSchema = new mongoose.Schema({
//   name: String,
//   email: String,
// });

// const Ticket = mongoose.model('Ticket', ticketSchema);

// app.post('/api/tickets', async (req, res) => {
//   const { name, email } = req.body;

//   try {
//     const ticket = new Ticket({ name, email });
//     await ticket.save();
//     res.status(201).json({ message: 'Ticket added successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get('/api/tickets', async (req, res) => {
//   try {
//     const tickets = await Ticket.find();
//     res.json(tickets);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.delete('/api/tickets/:id', async (req, res) => {
//   const id = req.params.id;

//   try {
//     await Ticket.findByIdAndDelete(id);
//     res.json({ message: 'Ticket removed successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/ticketingSystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ticketSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const Ticket = mongoose.model('Ticket', ticketSchema);

app.post('/api/tickets', async (req, res) => {
  const { name, email } = req.body;

  try {
    const ticket = new Ticket({ name, email });
    await ticket.save();

    // Emit an event to all connected clients that a ticket was added
    io.emit('ticketAdded', ticket);

    res.status(201).json({ message: 'Ticket added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tickets', async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tickets/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Ticket.findByIdAndDelete(id);

    // Emit an event to all connected clients that a ticket was removed
    io.emit('ticketRemoved', id);

    res.json({ message: 'Ticket removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listen for new connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for ticketAdded and ticketRemoved events and send them to all connected clients
  socket.on('ticketAdded', (ticket) => {
    io.emit('ticketAdded', ticket);
  });

  socket.on('ticketRemoved', (id) => {
    io.emit('ticketRemoved', id);
  });

  // Disconnect the socket when the user disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

const PORT = 3003;

server.listen(PORT, () => {
  console.log(`Server is running on http://192.168.1.74:${PORT}`);
});