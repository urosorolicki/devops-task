const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Sum App is running!',
        endpoints: {
            add: '/add?left=5&right=2'
        }
    });
});

app.get('/add', (req, res) => {
    const { left, right } = req.query;

    if (left === undefined || right === undefined) {
        return res.status(400).json({
            error: 'Both left and right parameters are required',
            example: '/add?left=5&right=2'
        });
    }

    const leftNum = parseInt(left, 10);
    const rightNum = parseInt(right, 10);

    if (isNaN(leftNum) || isNaN(rightNum)) {
        return res.status(400).json({
            error: 'Both left and right parameters must be valid integers',
            example: '/add?left=5&right=2'
        });
    }

    res.json({ sum: leftNum + rightNum });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;