const express = require('express');
const { sequelize } = require('./models'); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 3000;

// ...existing middleware and route setups...

// Example for Sequelize sync
sequelize.sync()
    .then(() => {
        console.log('Database sync success');
        // Start the server only after successful DB sync
        app.listen(PORT, () => {
            console.log('Server started on port', PORT);
        });
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

// ...existing code...