const { sequelize } = require('./db/models');

console.log('Starting database check...');

(async () => {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('✓ Database connection successful');

    console.log('Checking users in database...');
    const [users] = await sequelize.query(
      'SELECT id, name, email, role FROM users LIMIT 20',
      { type: sequelize.QueryTypes.SELECT }
    );
    console.log('Found', users.length, 'users');
    console.log('Users:', users);

    // Check if user 88 exists specifically
    console.log('Checking user 88...');
    const [user88] = await sequelize.query(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      { replacements: [88], type: sequelize.QueryTypes.SELECT }
    );
    console.log('User 88 exists:', user88.length > 0);
    if (user88.length > 0) {
      console.log('User 88 details:', user88[0]);
    }

  } catch (err) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
  } finally {
    console.log('Database check completed');
    process.exit(0);
  }
})();
