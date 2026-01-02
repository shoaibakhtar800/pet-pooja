import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const seedDatabase = async () => {
    const client = await pool.connect();
    
    try {
        console.log('Starting database setup...\n');

        console.log('Creating Users table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) UNIQUE NOT NULL,
                status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Users table created!\n');

        console.log('Creating Categories table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Categories table created!\n');

        console.log('Creating Expenses table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
                amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
                date DATE NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Expenses table created!\n');

        console.log('Creating indexes...');
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
            CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
            CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
            CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);
        `);
        console.log('Indexes created!\n');

        console.log('Seeding Categories...');
        await client.query(`
            INSERT INTO categories (name) VALUES 
                ('Food & Dining'),
                ('Transportation'),
                ('Shopping'),
                ('Entertainment'),
                ('Bills & Utilities'),
                ('Healthcare'),
                ('Travel'),
                ('Education'),
                ('Personal Care'),
                ('Others')
            ON CONFLICT (name) DO NOTHING;
        `);
        const categoriesResult = await client.query('SELECT COUNT(*) FROM categories');
        console.log(`Categories seeded! (${categoriesResult.rows[0].count} total)\n`);

        console.log('Seeding Users...');
        await client.query(`
            INSERT INTO users (name, email, status) VALUES 
                ('Shoaib Akhtar', 'shoaib@example.com', 'active'),
                ('Rahul Sharma', 'rahul@example.com', 'active'),
                ('Priya Patel', 'priya@example.com', 'active'),
                ('Amit Kumar', 'amit@example.com', 'active'),
                ('Neha Singh', 'neha@example.com', 'inactive')
            ON CONFLICT (email) DO NOTHING;
        `);
        const usersResult = await client.query('SELECT COUNT(*) FROM users');
        console.log(`Users seeded! (${usersResult.rows[0].count} total)\n`);

        console.log('Seeding Expenses...');
        await client.query(`
            INSERT INTO expenses (user_id, category_id, amount, date, description) VALUES
                -- User 1 (Shoaib) - Current month
                (1, 1, 250.00, CURRENT_DATE - INTERVAL '1 day', 'Dinner at restaurant'),
                (1, 2, 500.00, CURRENT_DATE - INTERVAL '2 days', 'Fuel'),
                (1, 3, 1500.00, CURRENT_DATE - INTERVAL '3 days', 'Online shopping'),
                (1, 4, 300.00, CURRENT_DATE - INTERVAL '5 days', 'Movie tickets'),
                (1, 5, 2000.00, CURRENT_DATE - INTERVAL '7 days', 'Electricity bill'),
                (1, 1, 450.00, CURRENT_DATE - INTERVAL '1 day', 'Lunch with team'),
                (1, 6, 800.00, CURRENT_DATE - INTERVAL '10 days', 'Medicine'),
                
                -- User 1 - Last month
                (1, 1, 350.00, CURRENT_DATE - INTERVAL '35 days', 'Restaurant'),
                (1, 2, 600.00, CURRENT_DATE - INTERVAL '40 days', 'Taxi'),
                (1, 3, 2000.00, CURRENT_DATE - INTERVAL '45 days', 'Electronics'),
                
                -- User 1 - Two months ago
                (1, 1, 400.00, CURRENT_DATE - INTERVAL '65 days', 'Groceries'),
                (1, 5, 1800.00, CURRENT_DATE - INTERVAL '70 days', 'Internet bill'),
                (1, 7, 5000.00, CURRENT_DATE - INTERVAL '75 days', 'Weekend trip'),
                
                -- User 1 - Three months ago
                (1, 1, 300.00, CURRENT_DATE - INTERVAL '95 days', 'Food'),
                (1, 3, 1200.00, CURRENT_DATE - INTERVAL '100 days', 'Clothes'),
                
                -- User 2 (Rahul) - Current month
                (2, 1, 180.00, CURRENT_DATE - INTERVAL '1 day', 'Breakfast'),
                (2, 2, 350.00, CURRENT_DATE - INTERVAL '3 days', 'Metro pass'),
                (2, 8, 15000.00, CURRENT_DATE - INTERVAL '5 days', 'Course fee'),
                (2, 4, 200.00, CURRENT_DATE - INTERVAL '8 days', 'Concert ticket'),
                
                -- User 2 - Last month
                (2, 1, 500.00, CURRENT_DATE - INTERVAL '38 days', 'Party'),
                (2, 6, 1200.00, CURRENT_DATE - INTERVAL '42 days', 'Doctor visit'),
                
                -- User 2 - Two months ago
                (2, 3, 3000.00, CURRENT_DATE - INTERVAL '68 days', 'Gadgets'),
                (2, 5, 1500.00, CURRENT_DATE - INTERVAL '72 days', 'Phone bill'),
                
                -- User 3 (Priya) - Current month
                (3, 9, 500.00, CURRENT_DATE - INTERVAL '2 days', 'Spa'),
                (3, 1, 600.00, CURRENT_DATE - INTERVAL '4 days', 'Fine dining'),
                (3, 3, 4000.00, CURRENT_DATE - INTERVAL '6 days', 'Jewelry'),
                (3, 7, 8000.00, CURRENT_DATE - INTERVAL '12 days', 'Vacation'),
                
                -- User 3 - Last month
                (3, 1, 800.00, CURRENT_DATE - INTERVAL '36 days', 'Restaurant'),
                (3, 4, 1000.00, CURRENT_DATE - INTERVAL '44 days', 'Events'),
                
                -- User 4 (Amit) - Current month
                (4, 1, 120.00, CURRENT_DATE - INTERVAL '1 day', 'Street food'),
                (4, 2, 80.00, CURRENT_DATE - INTERVAL '1 day', 'Bus fare'),
                (4, 10, 200.00, CURRENT_DATE - INTERVAL '5 days', 'Misc items'),
                
                -- User 4 - Last month
                (4, 5, 900.00, CURRENT_DATE - INTERVAL '40 days', 'Rent share'),
                (4, 1, 300.00, CURRENT_DATE - INTERVAL '45 days', 'Groceries')
            ON CONFLICT DO NOTHING;
        `);
        const expensesResult = await client.query('SELECT COUNT(*) FROM expenses');
        console.log(`Expenses seeded! (${expensesResult.rows[0].count} total)\n`);

        console.log('═══════════════════════════════════════════');
        console.log('DATABASE SETUP COMPLETED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════\n');

        console.log('Summary:');
        console.log(`   Users:      ${usersResult.rows[0].count}`);
        console.log(`   Categories: ${categoriesResult.rows[0].count}`);
        console.log(`   Expenses:   ${expensesResult.rows[0].count}`);
        console.log('');

    } catch (error) {
        console.error('Error during database setup:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
};

seedDatabase()
    .then(() => {
        console.log('Seed script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seed script failed:', error);
        process.exit(1);
    });

