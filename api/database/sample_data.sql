-- Clear existing data (order matters due to foreign keys)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM product_ingredients;
DELETE FROM products;
DELETE FROM inventory;

-- Reset sequences to start from 1
ALTER SEQUENCE products_product_id_seq RESTART WITH 1;
ALTER SEQUENCE inventory_inventory_id_seq RESTART WITH 1;
ALTER SEQUENCE product_ingredients_product_ingredient_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_order_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_order_item_id_seq RESTART WITH 1;

-- =====================
-- INSERT PRODUCTS FIRST
-- =====================
INSERT INTO products (product_name, category, size, price, is_available, icon, color, description) VALUES
('Classic Milk Tea', 'Milk Tea', 'Medium', 4.50, true, '☕', '#f472b6', 'Traditional Black Tea with Milk'),
('Taro Milk Tea', 'Milk Tea', 'Medium', 5.25, true, '🌱', '#c084fc', 'Creamy Taro Flavor'),
('Thai Milk Tea', 'Milk Tea', 'Medium', 4.75, true, '☕', '#fb923c', 'Spiced with Condensed Milk'),
('Matcha Milk Tea', 'Milk Tea', 'Medium', 5.50, true, '🍃', '#4ade80', 'Premium Matcha Blend'),
('Brown Sugar Milk Tea', 'Milk Tea', 'Medium', 6.00, true, '☕', '#d97706', 'Rich Brown Sugar Syrup'),
('Hokkaido Milk Tea', 'Milk Tea', 'Medium', 5.75, true, '❄️', '#60a5fa', 'Premium Hokkaido Milk'),
('Mango Tea', 'Fruit Tea', 'Medium', 5.00, true, '🥭', '#fbbf24', 'Fresh Mango Flavor'),
('Strawberry Tea', 'Fruit Tea', 'Medium', 5.00, true, '🍓', '#f87171', 'Sweet Strawberry Blend'),
('Passion Fruit Tea', 'Fruit Tea', 'Medium', 5.25, true, '🍊', '#fb923c', 'Tropical Passion Fruit'),
('Lychee Tea', 'Fruit Tea', 'Medium', 5.00, true, '🍑', '#fda4af', 'Sweet Lychee Flavor'),
('Berry Smoothie', 'Smoothies', 'Medium', 6.50, true, '🫐', '#a855f7', 'Mixed Berry Blend'),
('Mango Smoothie', 'Smoothies', 'Medium', 6.00, true, '🥭', '#fbbf24', 'Tropical Mango'),
('Avocado Smoothie', 'Smoothies', 'Medium', 6.25, true, '🥑', '#22c55e', 'Creamy Avocado'),
('Espresso', 'Coffee', 'Small', 3.50, true, '☕', '#92400e', 'Strong Espresso Shot'),
('Latte', 'Coffee', 'Medium', 4.50, true, '☕', '#d97706', 'Smooth Milk Coffee'),
('Cappuccino', 'Coffee', 'Medium', 4.75, true, '☕', '#b45309', 'Foamy Cappuccino'),
('Boba Pearls', 'Toppings', 'Portion', 0.75, true, '⚫', '#374151', 'Classic Tapioca Pearls'),
('Pudding', 'Toppings', 'Portion', 1.00, true, '🍮', '#fde047', 'Creamy Egg Pudding'),
('Aloe Vera', 'Toppings', 'Portion', 0.75, true, '🌿', '#22c55e', 'Fresh Aloe Vera'),
('Jelly', 'Toppings', 'Portion', 0.75, true, '🟣', '#a855f7', 'Fruit Jelly'),
('Popcorn Chicken', 'Snacks', 'Medium', 5.50, true, '🍗', '#f97316', 'Crispy Chicken Bites'),
('Spring Rolls', 'Snacks', 'Medium', 4.50, true, '🥟', '#fbbf24', 'Crispy Spring Rolls'),
('Fries', 'Snacks', 'Medium', 3.50, true, '🍟', '#eab308', 'Golden French Fries'),
('Chestnut Milk Tea', 'Milk Tea', 'Medium', 6.50, true, '🌰', '#a16207', 'Roasted Chestnut with Milk'),
('Gingerbread Latte', 'Coffee', 'Medium', 5.75, true, '🎄', '#92400e', 'Spiced Gingerbread and Espresso'),
('Peppermint Mocha', 'Coffee', 'Medium', 5.50, true, '🍫', '#6b4423', 'Chocolate with Peppermint'),
('Honey Cinnamon Tea', 'Fruit Tea', 'Medium', 5.25, true, '🍯', '#f59e0b', 'Warm Honey and Cinnamon Blend'),
('White Chocolate Matcha', 'Smoothies', 'Medium', 6.25, true, '🍃', '#f3f4f6', 'Creamy White Chocolate with Matcha');

-- =====================
-- INSERT INVENTORY ITEMS
-- =====================
INSERT INTO inventory (item_name, quantity, unit, reorder_level) VALUES
('Black Tea', 500.00, 'grams', 100.00),
('Milk', 300.00, 'liters', 50.00),
('Taro Powder', 200.00, 'grams', 50.00),
('Thai Tea Mix', 150.00, 'grams', 30.00),
('Matcha Powder', 100.00, 'grams', 20.00),
('Brown Sugar Syrup', 400.00, 'ml', 100.00),
('Hokkaido Milk', 250.00, 'ml', 50.00),
('Mango Puree', 300.00, 'ml', 50.00),
('Strawberry Puree', 250.00, 'ml', 50.00),
('Passion Fruit Puree', 200.00, 'ml', 40.00),
('Lychee Juice', 250.00, 'ml', 50.00),
('Mixed Berries', 400.00, 'grams', 100.00),
('Avocado', 50.00, 'units', 10.00),
('Espresso Beans', 1000.00, 'grams', 200.00),
('Boba Pearls', 500.00, 'grams', 100.00),
('Egg Pudding', 300.00, 'grams', 50.00),
('Aloe Vera', 200.00, 'grams', 40.00),
('Jelly Mix', 150.00, 'grams', 30.00),
('Chicken', 1000.00, 'grams', 200.00),
('Spring Roll Wrappers', 500.00, 'units', 100.00),
('Potatoes', 2000.00, 'grams', 500.00),
('Condensed Milk', 200.00, 'ml', 50.00),
('Sugar Syrup', 500.00, 'ml', 100.00),
('Cups', 5000.00, 'units', 500.00),
('Straws', 5000.00, 'units', 500.00),
('Roasted Chestnuts', 400.00, 'grams', 80.00),
('Gingerbread Syrup', 300.00, 'ml', 60.00),
('Cacao Powder', 200.00, 'grams', 40.00),
('Peppermint Syrup', 250.00, 'ml', 50.00),
('Honey', 400.00, 'ml', 80.00),
('Cinnamon', 50.00, 'grams', 10.00),
('White Chocolate Sauce', 300.00, 'ml', 60.00);


-- ========================
-- INSERT PRODUCT INGREDIENTS
-- ========================
INSERT INTO product_ingredients (product_id, inventory_id, quantity_needed) VALUES
-- Milk Tea products: Black Tea (1), Milk (2), Sugar Syrup (23), Cup (24), Straw (25)
(1, 1, 10.00), (1, 2, 150.00), (1, 23, 20.00), (1, 24, 1.00), (1, 25, 1.00),  -- Classic Milk Tea
(2, 1, 10.00), (2, 2, 150.00), (2, 3, 5.00), (2, 23, 20.00), (2, 24, 1.00), (2, 25, 1.00),  -- Taro Milk Tea
(3, 4, 10.00), (3, 2, 150.00), (3, 23, 20.00), (3, 24, 1.00), (3, 25, 1.00),  -- Thai Milk Tea
(4, 5, 3.00), (4, 2, 150.00), (4, 23, 20.00), (4, 24, 1.00), (4, 25, 1.00),  -- Matcha Milk Tea
(5, 1, 10.00), (5, 2, 150.00), (5, 6, 30.00), (5, 24, 1.00), (5, 25, 1.00),  -- Brown Sugar Milk Tea
(6, 1, 10.00), (6, 7, 150.00), (6, 23, 20.00), (6, 24, 1.00), (6, 25, 1.00),  -- Hokkaido Milk Tea
-- Fruit Tea products
(7, 8, 50.00), (7, 1, 5.00), (7, 23, 15.00), (7, 24, 1.00), (7, 25, 1.00),  -- Mango Tea
(8, 9, 50.00), (8, 1, 5.00), (8, 23, 15.00), (8, 24, 1.00), (8, 25, 1.00),  -- Strawberry Tea
(9, 10, 50.00), (9, 1, 5.00), (9, 23, 15.00), (9, 24, 1.00), (9, 25, 1.00),  -- Passion Fruit Tea
(10, 11, 50.00), (10, 1, 5.00), (10, 23, 15.00), (10, 24, 1.00), (10, 25, 1.00),  -- Lychee Tea
-- Smoothies
(11, 12, 100.00), (11, 2, 200.00), (11, 23, 20.00), (11, 24, 1.00), (11, 25, 1.00),  -- Berry Smoothie
(12, 8, 100.00), (12, 2, 200.00), (12, 23, 20.00), (12, 24, 1.00), (12, 25, 1.00),  -- Mango Smoothie
(13, 13, 0.5), (13, 2, 200.00), (13, 23, 20.00), (13, 24, 1.00), (13, 25, 1.00),  -- Avocado Smoothie
-- Coffee products
(14, 14, 15.00), (14, 24, 1.00), (14, 25, 1.00),  -- Espresso
(15, 14, 15.00), (15, 2, 150.00), (15, 23, 10.00), (15, 24, 1.00), (15, 25, 1.00),  -- Latte
(16, 14, 15.00), (16, 2, 100.00), (16, 23, 10.00), (16, 24, 1.00), (16, 25, 1.00),  -- Cappuccino
-- Toppings
(17, 15, 25.00),  -- Boba Pearls
(18, 16, 40.00),  -- Pudding
(19, 17, 30.00),  -- Aloe Vera
(20, 18, 25.00),  -- Jelly
-- Snacks
(21, 19, 100.00),  -- Popcorn Chicken
(22, 20, 5.00),  -- Spring Rolls
(23, 21, 150.00),  -- Fries
-- Winter Drinks
(24, 1, 10.00), (24, 2, 150.00), (24, 26, 30.00), (24, 23, 15.00), (24, 24, 1.00), (24, 25, 1.00),  -- Chestnut Milk Tea
(25, 14, 15.00), (25, 2, 150.00), (25, 27, 20.00), (25, 23, 10.00), (25, 24, 1.00), (25, 25, 1.00),  -- Gingerbread Latte
(26, 14, 15.00), (26, 2, 100.00), (26, 28, 10.00), (26, 29, 15.00), (26, 23, 10.00), (26, 24, 1.00), (26, 25, 1.00),  -- Peppermint Mocha
(27, 1, 8.00), (27, 30, 20.00), (27, 31, 5.00), (27, 23, 15.00), (27, 24, 1.00), (27, 25, 1.00),  -- Honey Cinnamon Tea
(28, 5, 3.00), (28, 2, 150.00), (28, 32, 25.00), (28, 23, 20.00), (28, 24, 1.00), (28, 25, 1.00);  -- White Chocolate Matcha