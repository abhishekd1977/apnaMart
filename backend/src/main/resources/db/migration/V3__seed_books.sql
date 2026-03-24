-- Seed sample books (Technology category)
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT
  uuid_generate_v4(),
  c.id,
  'Clean Code: A Handbook of Agile Software Craftsmanship',
  'Robert C. Martin',
  '9780132350884',
  'A handbook of agile software craftsmanship that teaches programmers how to write clean, maintainable code.',
  699.00,
  999.00,
  'Prentice Hall',
  2008,
  'English',
  431,
  50
FROM categories c WHERE c.slug = 'technology';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT
  uuid_generate_v4(),
  c.id,
  'The Pragmatic Programmer',
  'David Thomas, Andrew Hunt',
  '9780135957059',
  'A journey through the world of software development that covers career planning and software architecture.',
  799.00,
  1099.00,
  'Addison-Wesley',
  2019,
  'English',
  352,
  30
FROM categories c WHERE c.slug = 'technology';

-- Seed sample books (Self-Help category)
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT
  uuid_generate_v4(),
  c.id,
  'Atomic Habits',
  'James Clear',
  '9780735211292',
  'An easy and proven way to build good habits and break bad ones.',
  499.00,
  699.00,
  'Avery',
  2018,
  'English',
  320,
  100
FROM categories c WHERE c.slug = 'self-help';

-- Seed sample books (Fiction category)
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT
  uuid_generate_v4(),
  c.id,
  'The Alchemist',
  'Paulo Coelho',
  '9780062315007',
  'A novel about following your dreams and listening to your heart.',
  299.00,
  399.00,
  'HarperOne',
  1988,
  'English',
  197,
  75
FROM categories c WHERE c.slug = 'fiction';
