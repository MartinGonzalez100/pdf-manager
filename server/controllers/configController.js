const fs = require('fs');
const state = require('../state');

exports.setPath = (req, res) => {
    const { path: dirPath } = req.body;

    if (!dirPath) {
        return res.status(400).json({ error: 'Path is required' });
    }

    if (!fs.existsSync(dirPath)) {
        return res.status(400).json({ error: 'Directory does not exist' });
    }

    if (!fs.lstatSync(dirPath).isDirectory()) {
        return res.status(400).json({ error: 'Path is not a directory' });
    }

    state.setTargetDirectory(dirPath);
    res.json({ message: 'Path set successfully', path: dirPath });
};

exports.getPath = (req, res) => {
    res.json({ path: state.getTargetDirectory() });
};
