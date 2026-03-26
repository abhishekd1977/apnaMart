-- Seed 3 additional books for the Children category

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, cover_image_url, publisher, published_year, language, pages, stock_quantity)
SELECT
  uuid_generate_v4(),
  c.id,
  'Charlotte''s Web',
  'E.B. White',
  '9780061124952',
  'The timeless story of the friendship between a pig named Wilbur and a clever spider named Charlotte who saves his life.',
  249.00,
  349.00,
  'https://covers.openlibrary.org/b/isbn/9780061124952-L.jpg',
  'HarperCollins',
  1952,
  'English',
  184,
  90
FROM categories c WHERE c.slug = 'children';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, cover_image_url, publisher, published_year, language, pages, stock_quantity)
SELECT
  uuid_generate_v4(),
  c.id,
  'The Lion, the Witch and the Wardrobe',
  'C.S. Lewis',
  '9780064404990',
  'Four siblings stumble through a wardrobe into the magical land of Narnia and join a battle against the White Witch.',
  299.00,
  449.00,
  'https://covers.openlibrary.org/b/isbn/9780064404990-L.jpg',
  'HarperCollins',
  1950,
  'English',
  208,
  75
FROM categories c WHERE c.slug = 'children';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, cover_image_url, publisher, published_year, language, pages, stock_quantity)
SELECT
  uuid_generate_v4(),
  c.id,
  'Matilda',
  'Roald Dahl',
  '9780142410370',
  'A brilliant young girl with telekinetic powers outwits her neglectful parents and tyrannical headmistress Miss Trunchbull.',
  279.00,
  399.00,
  'https://covers.openlibrary.org/b/isbn/9780142410370-L.jpg',
  'Puffin Books',
  1988,
  'English',
  240,
  110
FROM categories c WHERE c.slug = 'children';
