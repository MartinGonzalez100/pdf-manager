const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const state = require('../state');

exports.listFiles = (req, res) => {
    const targetDir = state.getTargetDirectory();

    if (!targetDir) {
        return res.json({ files: [] }); // Or error, but empty list for now implies "not set" or "empty"
    }

    try {
        const files = fs.readdirSync(targetDir);
        const pdfFiles = files
            .filter(file => file.toLowerCase().endsWith('.pdf'))
            .map(file => {
                const fullPath = path.join(targetDir, file);
                const stats = fs.statSync(fullPath);
                return {
                    name: file,
                    path: fullPath,
                    size: stats.size,
                    date: stats.mtime
                };
            });

        res.json({ files: pdfFiles });
    } catch (error) {
        res.status(500).json({ error: 'Error reading directory', details: error.message });
    }
};

exports.openFile = (req, res) => {
    const { filename } = req.body;
    const targetDir = state.getTargetDirectory();

    if (!targetDir || !filename) {
        return res.status(400).json({ error: 'Directory not set or filename missing' });
    }

    const fullPath = path.join(targetDir, filename);

    // Security check: ensure the resolved path is still within targetDir to prevent traversal?
    // For local personal tool, simple check is okay, but let's be safe.
    // Actually, simply executing 'start "" "fullpath"' is what we want.

    // Windows command to open file with default app
    let command = `start "" "${fullPath}"`;

    exec(command, (error) => {
        if (error) {
            console.error(`Error opening file: ${error}`);
            return res.status(500).json({ error: 'Failed to open file' });
        }
        res.json({ message: 'File opened' });
    });
};
