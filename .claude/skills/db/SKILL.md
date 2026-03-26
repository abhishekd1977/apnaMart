---
name: db
description: Run a SQL query against the apnaMart PostgreSQL database. Use when the user wants to inspect data, check records, or explore the database.
argument-hint: "[sql query]"
allowed-tools: Bash
---

Run this SQL query against the apnaMart database:

Query: $ARGUMENTS

Execute:
```
docker exec apnamart-postgres psql -U apnamart_user -d apnamart -c "$ARGUMENTS"
```

Format the output as a clean table and explain what the results mean in plain English.

If no query is provided, show a helpful overview:
```
docker exec apnamart-postgres psql -U apnamart_user -d apnamart -c "
  SELECT 'books' as table_name, count(*) FROM books
  UNION ALL SELECT 'users', count(*) FROM users
  UNION ALL SELECT 'carts', count(*) FROM carts
  UNION ALL SELECT 'orders', count(*) FROM orders;
"
```
