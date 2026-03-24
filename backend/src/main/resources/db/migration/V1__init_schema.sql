-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id            UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    phone         VARCHAR(20),
    role          VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
    id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BOOKS
-- ============================================================
CREATE TABLE books (
    id              UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id     UUID           NOT NULL REFERENCES categories(id),
    title           VARCHAR(500)   NOT NULL,
    author          VARCHAR(500)   NOT NULL,
    isbn            VARCHAR(20)    UNIQUE,
    description     TEXT,
    -- NUMERIC avoids floating-point rounding errors for monetary values
    price           NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    mrp             NUMERIC(10, 2),
    cover_image_url VARCHAR(1000),
    publisher       VARCHAR(255),
    published_year  SMALLINT,
    language        VARCHAR(50)    NOT NULL DEFAULT 'English',
    pages           INTEGER,
    stock_quantity  INTEGER        NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active       BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_books_category  ON books(category_id);
CREATE INDEX idx_books_isbn      ON books(isbn);
CREATE INDEX idx_books_is_active ON books(is_active);
-- Full-text search GIN index for title + author search
CREATE INDEX idx_books_fts ON books USING gin(
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(author, ''))
);

-- ============================================================
-- CARTS  (one active cart per user)
-- ============================================================
CREATE TABLE carts (
    id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID        NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CART ITEMS
-- ============================================================
CREATE TABLE cart_items (
    id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id     UUID           NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    book_id     UUID           NOT NULL REFERENCES books(id),
    quantity    INTEGER        NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(10, 2) NOT NULL,
    added_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_cart_book UNIQUE (cart_id, book_id)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
    id               UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id          UUID           NOT NULL REFERENCES users(id),
    status           VARCHAR(30)    NOT NULL DEFAULT 'PENDING',
    total_amount     NUMERIC(10, 2) NOT NULL,
    discount_amount  NUMERIC(10, 2) NOT NULL DEFAULT 0,
    shipping_amount  NUMERIC(10, 2) NOT NULL DEFAULT 0,
    final_amount     NUMERIC(10, 2) NOT NULL,
    payment_method   VARCHAR(50),
    payment_status   VARCHAR(30)    NOT NULL DEFAULT 'PENDING',
    -- JSONB snapshot: preserves the exact address used at order time
    -- even if the user's address changes later
    shipping_address JSONB          NOT NULL,
    notes            TEXT,
    ordered_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_ordered_at ON orders(ordered_at DESC);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE order_items (
    id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id    UUID           NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    book_id     UUID           NOT NULL REFERENCES books(id),
    -- Snapshot columns: preserve book title/author even if book is later edited
    title       VARCHAR(500)   NOT NULL,
    author      VARCHAR(500)   NOT NULL,
    quantity    INTEGER        NOT NULL CHECK (quantity > 0),
    unit_price  NUMERIC(10, 2) NOT NULL,
    subtotal    NUMERIC(10, 2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- TRIGGER: auto-update updated_at on every row change
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_carts_updated_at
    BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
