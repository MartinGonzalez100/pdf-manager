const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const filesController = require('./controllers/filesController');
const configController = require('./controllers/configController');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'PDF Manager API is running', status: 'OK' });
});
app.get('/api/files', filesController.listFiles);
app.post('/api/open', filesController.openFile);
app.post('/api/config/path', configController.setPath);
app.get('/api/config/path', configController.getPath);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
