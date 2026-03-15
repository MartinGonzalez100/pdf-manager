// Simple in-memory state
// In a real app, this might be a database or a config file
let targetDirectory = null;

module.exports = {
    getTargetDirectory: () => targetDirectory,
    setTargetDirectory: (path) => { targetDirectory = path; }
};
