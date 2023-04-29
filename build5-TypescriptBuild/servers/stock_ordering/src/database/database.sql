CREATE DATABASE stock_ordering

Create TABLE stock_orders (
    order_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_type TEXT NOT NULL,
    ticker TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price float NOT NULL,
    order_time TIMESTAMP NOT NULL,
    order_status TEXT NOT NULL
)