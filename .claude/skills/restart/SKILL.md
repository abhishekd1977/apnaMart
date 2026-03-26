---
name: restart
description: Restart one or all apnaMart Docker services. Use when the user wants to restart the backend, frontend, or the full stack.
argument-hint: "[backend|frontend|postgres|all]"
allowed-tools: Bash
---

Restart the specified apnaMart service: $0

- If $0 is "all" or empty: restart the full stack with `docker compose restart`
- If $0 is "backend", "frontend", or "postgres": restart just that container

Commands:
- All: `docker compose --project-directory /Users/abhishekdubey/code/apnaMart up -d --build`
- Single: `docker compose --project-directory /Users/abhishekdubey/code/apnaMart up -d --build $0`

Note: always use `--build` so new migration files and code changes are picked up.

After restarting, tail the logs to confirm it came back up healthy:
```
sleep 10 && docker logs apnamart-${0:-backend} --tail 20 2>&1
```

Report whether the service started successfully or if there are errors.
