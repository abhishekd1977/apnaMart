---
name: logs
description: Show recent apnaMart Docker logs. Use when the user wants to check errors, debug the backend, or see what the app is doing.
argument-hint: "[backend|frontend|postgres] [lines]"
allowed-tools: Bash
---

Show recent logs for the apnaMart stack.

Service argument: $0 (default: backend)
Lines argument: $1 (default: 50)

Run:
```
docker logs apnamart-${0:-backend} --tail ${1:-50} 2>&1
```

Then summarize:
- Any ERROR or WARN lines
- Any Flyway migration activity
- Startup status
- If no issues found, say so clearly
