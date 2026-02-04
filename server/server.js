const express = require('express');
const path = require('path')
const app = express();
const PORT = 3000;

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, server here!');
});

app.get('/testikuva', (req, res) => {
  res.sendFile(path.join(__dirname, 'test_material', 'testikuva.png'));

});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});