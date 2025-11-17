#!/usr/bin/env python3
"""
Simple stdio-based MCP-like server for local development.

Protocol (JSON lines):
  Request: {"id": <int>, "type": "initialize"|"list_tools"|"call_tool", ...}
  Response: {"id": <int>, "ok": true, "result": ...} or {"id": <int>, "ok": false, "error": "..."}

This server is intentionally minimal and uses the project's mock data. It's not a full MCP
implementation but provides the tools and behaviors needed by the local client.
"""
import sys
import json
from typing import List
from pathlib import Path
import importlib.util

# Load mock_data.py from the sibling models directory without requiring package imports
_here = Path(__file__).resolve().parent
_mock_path = _here / "models" / "mock_data.py"
spec = importlib.util.spec_from_file_location("mock_data", str(_mock_path))
mock_data = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mock_data)


def _write(obj):
    sys.stdout.write(json.dumps(obj, default=str) + "\n")
    sys.stdout.flush()


def list_tools():
    return [
        {"id": "predict_churn", "name": "Predict Churn", "description": "Predict employee churn from attributes"},
    ]


def predict_churn(data: List[dict]):
    # Expect a list of dicts; we'll evaluate the first sample with a simple heuristic
    if not isinstance(data, list) or len(data) == 0:
        return {"error": "data must be a non-empty list"}

    payload = data[0]
    years = float(payload.get("YearsAtCompany", 0))
    sat = float(payload.get("EmployeeSatisfaction", 1.0))

    # simple rule: churn likely if years < 2 or satisfaction < 0.5
    churn = 1 if (years < 2 or sat < 0.5) else 0
    reason = []
    if years < 2:
        reason.append("short_tenure")
    if sat < 0.5:
        reason.append("low_satisfaction")

    return {"churn": churn, "reason": ",".join(reason) if reason else "stable"}


def handle_call_tool(req):
    tool = req.get("tool")
    arguments = req.get("arguments", {})
    try:
        if tool == "predict_churn":
            return {"ok": True, "result": predict_churn(arguments)}
        elif tool == "list_projects":
            # Return the mock projects
            return {"ok": True, "result": mock_data.PROJECTS}
        else:
            return {"ok": False, "error": f"Unknown tool: {tool}"}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def main():
    # Read lines from stdin
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            req = json.loads(line)
        except Exception as e:
            _write({"id": None, "ok": False, "error": f"invalid json: {e}"})
            continue

        rid = req.get("id")
        rtype = req.get("type")

        try:
            if rtype == "initialize":
                _write({"id": rid, "ok": True, "result": {"status": "initialized"}})
            elif rtype == "list_tools":
                _write({"id": rid, "ok": True, "result": list_tools()})
            elif rtype == "call_tool":
                resp = handle_call_tool(req)
                resp["id"] = rid
                _write(resp)
            else:
                _write({"id": rid, "ok": False, "error": f"unknown type: {rtype}"})
        except Exception as e:
            _write({"id": rid, "ok": False, "error": str(e)})


if __name__ == "__main__":
    main()
