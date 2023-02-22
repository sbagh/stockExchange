CREATE DATABASE stock_orders

Create TABLE stock_orders (
    order_id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user_accounts(user_id),
    order_type TEXT NOT NULL,
    ticker TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    order_time TIMESTAMP NOT NULL,
    order_status TEXT NOT NULL
)