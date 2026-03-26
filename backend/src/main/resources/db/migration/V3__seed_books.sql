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

-- Technology
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'Design Patterns: Elements of Reusable Object-Oriented Software',
  'Gang of Four',
  '9780201633610',
  'A classic reference introducing 23 foundational design patterns for object-oriented software development.',
  899.00, 1299.00, 'Addison-Wesley', 1994, 'English', 395, 40
FROM categories c WHERE c.slug = 'technology';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'You Don''t Know JS: Scope & Closures',
  'Kyle Simpson',
  '9781491904151',
  'A deep dive into the core mechanisms of the JavaScript language — scope, closures, and the module pattern.',
  549.00, 749.00, 'O''Reilly Media', 2014, 'English', 98, 60
FROM categories c WHERE c.slug = 'technology';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'System Design Interview – An Insider''s Guide',
  'Alex Xu',
  '9798664653403',
  'A step-by-step framework for tackling system design questions in software engineering interviews.',
  999.00, 1399.00, 'Byte Code LLC', 2020, 'English', 322, 45
FROM categories c WHERE c.slug = 'technology';

-- Fiction
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'To Kill a Mockingbird',
  'Harper Lee',
  '9780061935466',
  'A powerful story of racial injustice and childhood innocence set in the American South.',
  349.00, 499.00, 'HarperCollins', 1960, 'English', 281, 80
FROM categories c WHERE c.slug = 'fiction';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  '1984',
  'George Orwell',
  '9780451524935',
  'A dystopian novel about totalitarianism, surveillance, and the suppression of truth.',
  249.00, 349.00, 'Signet Classic', 1949, 'English', 328, 90
FROM categories c WHERE c.slug = 'fiction';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'The Hitchhiker''s Guide to the Galaxy',
  'Douglas Adams',
  '9780345391803',
  'A comedic science-fiction adventure following the last human after Earth is demolished to make way for a hyperspace bypass.',
  299.00, 449.00, 'Del Rey', 1979, 'English', 193, 65
FROM categories c WHERE c.slug = 'fiction';

-- Self-Help
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'The 7 Habits of Highly Effective People',
  'Stephen R. Covey',
  '9780743269513',
  'A principle-centered approach to personal and professional effectiveness through seven transformative habits.',
  549.00, 799.00, 'Free Press', 1989, 'English', 381, 70
FROM categories c WHERE c.slug = 'self-help';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'Deep Work: Rules for Focused Success in a Distracted World',
  'Cal Newport',
  '9781455586691',
  'Argues that focused, undistracted work is the superpower of the 21st century and shows how to cultivate it.',
  499.00, 699.00, 'Grand Central Publishing', 2016, 'English', 296, 55
FROM categories c WHERE c.slug = 'self-help';

-- Non-Fiction
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'Sapiens: A Brief History of Humankind',
  'Yuval Noah Harari',
  '9780062316097',
  'A sweeping narrative of human history from the Stone Age to the modern era.',
  599.00, 899.00, 'Harper', 2011, 'English', 443, 85
FROM categories c WHERE c.slug = 'non-fiction';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'Educated',
  'Tara Westover',
  '9780399590504',
  'A memoir about a young woman who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
  449.00, 649.00, 'Random House', 2018, 'English', 334, 50
FROM categories c WHERE c.slug = 'non-fiction';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'The Immortal Life of Henrietta Lacks',
  'Rebecca Skloot',
  '9781400052189',
  'The story of the first immortal human cell line and the woman whose cells were taken without her knowledge.',
  399.00, 599.00, 'Crown', 2010, 'English', 369, 35
FROM categories c WHERE c.slug = 'non-fiction';

-- History
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'India After Gandhi: The History of the World''s Largest Democracy',
  'Ramachandra Guha',
  '9780060958589',
  'A comprehensive history of independent India, covering its turbulent political, social, and cultural journey.',
  799.00, 1199.00, 'HarperCollins', 2007, 'English', 900, 40
FROM categories c WHERE c.slug = 'history';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'Guns, Germs, and Steel',
  'Jared Diamond',
  '9780393317558',
  'An exploration of why some civilizations came to dominate others, through the lens of geography and environment.',
  549.00, 799.00, 'W. W. Norton', 1997, 'English', 480, 45
FROM categories c WHERE c.slug = 'history';

-- Business
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'Zero to One: Notes on Startups, or How to Build the Future',
  'Peter Thiel',
  '9780804139021',
  'Peter Thiel shares his contrarian philosophy on startups and how to build companies that create new things.',
  499.00, 699.00, 'Crown Business', 2014, 'English', 195, 60
FROM categories c WHERE c.slug = 'business';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'The Lean Startup',
  'Eric Ries',
  '9780307887894',
  'How continuous innovation creates radically successful businesses using validated learning and rapid experimentation.',
  449.00, 649.00, 'Crown Business', 2011, 'English', 336, 55
FROM categories c WHERE c.slug = 'business';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'Thinking, Fast and Slow',
  'Daniel Kahneman',
  '9780374533557',
  'A Nobel Prize-winning psychologist''s exploration of the two systems that drive human thought.',
  599.00, 849.00, 'Farrar, Straus and Giroux', 2011, 'English', 499, 50
FROM categories c WHERE c.slug = 'business';

-- Children
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'Harry Potter and the Philosopher''s Stone',
  'J.K. Rowling',
  '9780439708180',
  'The magical story of a young boy who discovers he is a wizard and begins his journey at Hogwarts School of Witchcraft and Wizardry.',
  399.00, 599.00, 'Scholastic', 1997, 'English', 309, 120
FROM categories c WHERE c.slug = 'children';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'The Little Prince',
  'Antoine de Saint-Exupéry',
  '9780156012195',
  'A poetic tale about a young prince who travels the universe in search of true friendship and love.',
  199.00, 299.00, 'Harcourt', 1943, 'English', 96, 100
FROM categories c WHERE c.slug = 'children';

-- Comics & Manga
INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'Watchmen',
  'Alan Moore, Dave Gibbons',
  '9781401245252',
  'A groundbreaking graphic novel that deconstructs the superhero genre in an alternate-history 1985 America.',
  699.00, 999.00, 'DC Comics', 1987, 'English', 416, 35
FROM categories c WHERE c.slug = 'comics-manga';

INSERT INTO books (id, category_id, title, author, isbn, description, price, mrp, publisher, published_year, language, pages, stock_quantity)
SELECT uuid_generate_v4(), c.id,
  'Naruto, Vol. 1: The Tests of the Ninja',
  'Masashi Kishimoto',
  '9781569319000',
  'The beginning of Naruto''s journey as a young ninja-in-training who dreams of becoming the greatest ninja of all.',
  299.00, 399.00, 'VIZ Media', 2003, 'English', 192, 80
FROM categories c WHERE c.slug = 'comics-manga';
