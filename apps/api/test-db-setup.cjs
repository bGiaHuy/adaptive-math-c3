const { default: EmbeddedPostgres } = require('embedded-postgres');
const path = require('path');
const fs = require('fs');
const { Client } = require('pg');

async function setup() {
  const dataDir = path.join(__dirname, '.embedded-test-db');
  const pg = new EmbeddedPostgres({
    port: 5432,
    databaseDir: dataDir,
    user: 'am',
    password: 'am_dev_password',
    database: 'postgres',
    persistent: true
  });

  const hbaPath = path.join(dataDir, 'pg_hba.conf');
  if (!fs.existsSync(hbaPath)) {
    console.log('Initialising cluster with user "am"...');
    await pg.initialise();
  }

  // Ensure trust auth for localhost in test DB
  if (fs.existsSync(hbaPath)) {
    let hba = fs.readFileSync(hbaPath, 'utf8');
    hba = hba.replace(/password/g, 'trust');
    fs.writeFileSync(hbaPath, hba, 'utf8');
  }

  try {
    await pg.start();
    console.log('PostgreSQL started on port 5432.');
  } catch (err) {
    console.log('PostgreSQL already running on port 5432.');
  }

  // Connect as 'am' to 'postgres'
  console.log('Connecting as am to postgres database...');
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'am',
    password: 'am_dev_password',
    database: 'postgres'
  });
  await client.connect();
  console.log('Connected to default postgres database as am.');

  await client.query("DROP DATABASE IF EXISTS adaptivemath_test");
  await client.query("CREATE DATABASE adaptivemath_test WITH ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C' TEMPLATE = template0 OWNER am");
  console.log('Database "adaptivemath_test" created with UTF8 encoding.');
  await client.end();

  // Test connecting as 'am' to 'adaptivemath_test'
  const testClient = new Client({
    connectionString: 'postgresql://am:am_dev_password@127.0.0.1:5432/adaptivemath_test'
  });
  await testClient.connect();
  const res = await testClient.query('SELECT current_user, current_database()');
  console.log('Connected to test DB:', res.rows[0]);
  await testClient.end();
  console.log('✓ Isolated test DB setup complete and verified with UTF8!');
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
