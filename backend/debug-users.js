const { sequelize } = require('./db/models');

console.log('🔍 Debugging: Checking what users exist in database...\n');

(async () => {
  try {
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection: OK\n');

    // Get all users
    const [users] = await sequelize.query(
      'SELECT id, name, email, role FROM users ORDER BY id LIMIT 50',
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log(`📊 Found ${users.length} users in database:\n`);

    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('💡 You might need to create some users first or check if the database is properly seeded.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}, Name: "${user.name}", Email: "${user.email}", Role: "${user.role}"`);
      });

      console.log(`\n🔍 Looking for user ID 88...`);
      const user88 = users.find(u => u.id === 88);
      if (user88) {
        console.log(`✅ User 88 exists:`, user88);
      } else {
        console.log(`❌ User 88 does NOT exist in the database.`);
        console.log(`💡 Available user IDs are:`, users.map(u => u.id).join(', '));
      }
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    console.log('\n🔚 Debug check completed.');
    process.exit(0);
  }
})();
