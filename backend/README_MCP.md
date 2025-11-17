MCP-like local server and client
================================

This folder contains a minimal stdio-based MCP-like server and a client that
spawns it. It's designed for local development and demos and uses the project's
mock data (see `backend/models/mock_data.py`).

Files added
- `mcp_stdio_server.py` - a lightweight stdio JSON-lines server exposing tools:
  - `predict_churn` (uses a simple heuristic)
  - `list_projects` (returns `mock_data.PROJECTS`)
- `mcp_client.py` - interactive client that spawns the server and offers a menu to
  call tools and exercise local prompt templates.

How to run
----------
Run the interactive client (it will spawn the server automatically):

```bash
python backend/mcp_client.py
```

Notes
-----
- This is not a full MCP implementation; it's a small compatibility shim to
  exercise tools over stdio without adding external dependencies.
- If you'd like a full MCP server compatible with the `mcp` package from
  third-party repos, we can add the package and rewrite the server to use it.
