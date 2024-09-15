const express = require('express');  // Import Express
const bodyParser = require('body-parser');  // Import Body-Parser
const cors = require('cors');  // Import CORS

const clientRoutes = require('./routes/clientRoutes');  // Import client routes
const petRoutes = require('./routes/petRoutes');  // Import pet routes

const app = express();  // Initialize Express

app.use(cors());  // Use CORS middleware
app.use(bodyParser.json());  // Use Body-Parser middleware

// Root route for the application
app.get('/', (req, res) => {
  res.send('Welcome to the Dog Daycare App!');
});

// Use the routes for clients and pets
app.use('/clients', clientRoutes);
app.use('/pets', petRoutes);

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);  // Print message to console
});
