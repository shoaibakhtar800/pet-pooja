CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);

-- =============================================
-- SEED DATA
-- =============================================

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

INSERT INTO users (name, email, status) VALUES 
    ('Shoaib Akhtar', 'shoaib@example.com', 'active'),
    ('Rahul Sharma', 'rahul@example.com', 'active'),
    ('Priya Patel', 'priya@example.com', 'active'),
    ('Amit Kumar', 'amit@example.com', 'active'),
    ('Neha Singh', 'neha@example.com', 'inactive')
ON CONFLICT (email) DO NOTHING;

INSERT INTO expenses (user_id, category_id, amount, date, description) VALUES
    (1, 1, 250.00, CURRENT_DATE - INTERVAL '1 day', 'Dinner at restaurant'),
    (1, 2, 500.00, CURRENT_DATE - INTERVAL '2 days', 'Fuel'),
    (1, 3, 1500.00, CURRENT_DATE - INTERVAL '3 days', 'Online shopping'),
    (1, 4, 300.00, CURRENT_DATE - INTERVAL '5 days', 'Movie tickets'),
    (1, 5, 2000.00, CURRENT_DATE - INTERVAL '7 days', 'Electricity bill'),
    (1, 1, 450.00, CURRENT_DATE - INTERVAL '1 day', 'Lunch with team'),
    (1, 6, 800.00, CURRENT_DATE - INTERVAL '10 days', 'Medicine'),
    
    (1, 1, 350.00, CURRENT_DATE - INTERVAL '35 days', 'Restaurant'),
    (1, 2, 600.00, CURRENT_DATE - INTERVAL '40 days', 'Taxi'),
    (1, 3, 2000.00, CURRENT_DATE - INTERVAL '45 days', 'Electronics'),
    
    (1, 1, 400.00, CURRENT_DATE - INTERVAL '65 days', 'Groceries'),
    (1, 5, 1800.00, CURRENT_DATE - INTERVAL '70 days', 'Internet bill'),
    (1, 7, 5000.00, CURRENT_DATE - INTERVAL '75 days', 'Weekend trip'),
    
    (1, 1, 300.00, CURRENT_DATE - INTERVAL '95 days', 'Food'),
    (1, 3, 1200.00, CURRENT_DATE - INTERVAL '100 days', 'Clothes'),
    
    (2, 1, 180.00, CURRENT_DATE - INTERVAL '1 day', 'Breakfast'),
    (2, 2, 350.00, CURRENT_DATE - INTERVAL '3 days', 'Metro pass'),
    (2, 8, 15000.00, CURRENT_DATE - INTERVAL '5 days', 'Course fee'),
    (2, 4, 200.00, CURRENT_DATE - INTERVAL '8 days', 'Concert ticket'),
    
    (2, 1, 500.00, CURRENT_DATE - INTERVAL '38 days', 'Party'),
    (2, 6, 1200.00, CURRENT_DATE - INTERVAL '42 days', 'Doctor visit'),
        
    (2, 3, 3000.00, CURRENT_DATE - INTERVAL '68 days', 'Gadgets'),
    (2, 5, 1500.00, CURRENT_DATE - INTERVAL '72 days', 'Phone bill'),
    
    (3, 9, 500.00, CURRENT_DATE - INTERVAL '2 days', 'Spa'),
    (3, 1, 600.00, CURRENT_DATE - INTERVAL '4 days', 'Fine dining'),
    (3, 3, 4000.00, CURRENT_DATE - INTERVAL '6 days', 'Jewelry'),
    (3, 7, 8000.00, CURRENT_DATE - INTERVAL '12 days', 'Vacation'),
    
    (3, 1, 800.00, CURRENT_DATE - INTERVAL '36 days', 'Restaurant'),
    (3, 4, 1000.00, CURRENT_DATE - INTERVAL '44 days', 'Events'),
    
    (4, 1, 120.00, CURRENT_DATE - INTERVAL '1 day', 'Street food'),
    (4, 2, 80.00, CURRENT_DATE - INTERVAL '1 day', 'Bus fare'),
    (4, 10, 200.00, CURRENT_DATE - INTERVAL '5 days', 'Misc items'),
    
    (4, 5, 900.00, CURRENT_DATE - INTERVAL '40 days', 'Rent share'),
    (4, 1, 300.00, CURRENT_DATE - INTERVAL '45 days', 'Groceries')
ON CONFLICT DO NOTHING;

