import psycopg2
import random
from datetime import datetime, timedelta
from decimal import Decimal
import os
from dotenv import load_dotenv

load_dotenv()

def connect_db():
    """Establish database connection"""
    try:
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT')
        )
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        raise

def clear_tables(cursor):
    """Clear all tables before seeding"""
    print("Clearing existing data...")
    cursor.execute("TRUNCATE users, inventory, products, orders RESTART IDENTITY CASCADE;")
    print("Tables cleared.")

def seed_users(cursor):
    """Insert fake users"""
    print("Seeding users...")
    users = [
        ('jdoe', 'John Doe', 'Manager', 'john@bobashop.com', '555-0101'),
        ('asmith', 'Alice Smith', 'Cashier', 'alice@bobashop.com', '555-0102'),
        ('bwilson', 'Bob Wilson', 'Cashier', 'bob@bobashop.com', '555-0103'),
        ('cmartinez', 'Carlos Martinez', 'Manager', 'carlos@bobashop.com', '555-0104'),
        ('djohnson', 'Diana Johnson', 'Cashier', 'diana@bobashop.com', '555-0105'),
    ]
    
    cursor.executemany(
        """INSERT INTO users (username, full_name, role, email, phone, is_active) 
           VALUES (%s, %s, %s, %s, %s, TRUE)""",
        users
    )
    print(f"Inserted {len(users)} users.")

def seed_inventory(cursor):
    """Insert inventory items"""
    print("Seeding inventory...")
    inventory_items = [
        ('Black Tea Leaves', 25.50, 'kg'),
        ('Green Tea Leaves', 18.75, 'kg'),
        ('Oolong Tea Leaves', 15.00, 'kg'),
        ('Tapioca Pearls', 50.00, 'kg'),
        ('Whole Milk', 100.00, 'liters'),
        ('Almond Milk', 30.00, 'liters'),
        ('Brown Sugar', 20.00, 'kg'),
        ('White Sugar', 25.00, 'kg'),
        ('Honey', 10.50, 'liters'),
        ('Mango Syrup', 8.00, 'liters'),
        ('Taro Powder', 12.00, 'kg'),
        ('Matcha Powder', 5.50, 'kg'),
        ('Strawberry Puree', 15.00, 'liters'),
        ('Lychee Syrup', 6.75, 'liters'),
        ('Ice', 200.00, 'kg'),
        ('Plastic Cups (Small)', 500, 'units'),
        ('Plastic Cups (Medium)', 450, 'units'),
        ('Plastic Cups (Large)', 400, 'units'),
        ('Straws', 1000, 'units'),
        ('Cup Lids', 800, 'units'),
    ]
    
    cursor.executemany(
        """INSERT INTO inventory (item_name, quantity, unit) 
           VALUES (%s, %s, %s)""",
        inventory_items
    )
    print(f"Inserted {len(inventory_items)} inventory items.")

def seed_products(cursor):
    """Insert products with different sizes"""
    print("Seeding products...")
    
    base_products = [
        ('Classic Milk Tea', 4.50),
        ('Taro Milk Tea', 5.00),
        ('Matcha Latte', 5.50),
        ('Brown Sugar Milk Tea', 5.75),
        ('Mango Green Tea', 4.75),
        ('Strawberry Fruit Tea', 5.25),
        ('Lychee Black Tea', 4.50),
        ('Oolong Milk Tea', 5.00),
        ('Honey Green Tea', 4.25),
        ('Thai Milk Tea', 5.50),
    ]
    
    sizes = ['Small', 'Medium', 'Large']
    size_multipliers = {'Small': 1.0, 'Medium': 1.2, 'Large': 1.4}
    
    products = []
    for product_name, base_price in base_products:
        for size in sizes:
            price = round(base_price * size_multipliers[size], 2)
            products.append((product_name, size, price))
    
    cursor.executemany(
        """INSERT INTO products (product_name, size, price, is_available) 
           VALUES (%s, %s, %s, TRUE)""",
        products
    )
    print(f"Inserted {len(products)} products.")

def seed_orders(cursor, num_orders=100):
    """Generate random orders"""
    print(f"Generating {num_orders} random orders...")
    
    # Get all product IDs and prices
    cursor.execute("SELECT product_id, price FROM products")
    products = cursor.fetchall()
    
    # Generate orders over the past 30 days
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    orders = []
    for _ in range(num_orders):
        # Random date within the past 30 days
        random_date = start_date + timedelta(
            seconds=random.randint(0, int((end_date - start_date).total_seconds()))
        )
        
        # Random number of items per order (1-5)
        num_items = random.randint(1, 5)
        selected_products = random.sample(products, min(num_items, len(products)))
        
        # Calculate total
        total = sum(float(price) for _, price in selected_products)
        
        orders.append((random_date, round(total, 2)))
    
    # Sort orders by date
    orders.sort(key=lambda x: x[0])
    
    cursor.executemany(
        """INSERT INTO orders (order_date, total_amount) 
           VALUES (%s, %s)""",
        orders
    )
    print(f"Inserted {num_orders} orders.")

def main():
    """Main seeding function"""
    try:
        conn = connect_db()
        cursor = conn.cursor()
        
        # Clear existing data
        clear_tables(cursor)
        
        # Seed all tables
        seed_users(cursor)
        seed_inventory(cursor)
        seed_products(cursor)
        seed_orders(cursor, num_orders=100)
        
        # Commit changes
        conn.commit()
        print("\n Database seeding completed successfully!")
        
        # Show summary
        cursor.execute("SELECT COUNT(*) FROM users")
        user_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM inventory")
        inventory_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM products")
        product_count = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM orders")
        order_count = cursor.fetchone()[0]
        
        print(f"\nDatabase Summary:")
        print(f"  Users: {user_count}")
        print(f"  Inventory Items: {inventory_count}")
        print(f"  Products: {product_count}")
        print(f"  Orders: {order_count}")
        
    except Exception as e:
        print(f"\n Error during seeding: {e}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
