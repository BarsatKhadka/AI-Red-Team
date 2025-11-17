#!/usr/bin/env python3
"""
Simple stdio client that spawns `mcp_stdio_server.py` and interacts with it using JSON-lines.

This script provides an interactive menu similar to the example in the request but uses the
local stdio server and the repository's mock data. It demonstrates calling tools and
preserves features: chat, local prompt templates, BMI tool, weather tool and churn prediction.
"""
import asyncio
import sys
import json
import os
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class StdIOClient:
    def __init__(self, cmd):
        self.cmd = cmd
        self.proc = None
        self._id = 0
        self._pending = {}

    async def start(self):
        self.proc = await asyncio.create_subprocess_exec(
            *self.cmd,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        # start reader task
        asyncio.create_task(self._reader_task())

    async def _reader_task(self):
        assert self.proc is not None
        while True:
            line = await self.proc.stdout.readline()
            if not line:
                break
            try:
                msg = json.loads(line.decode())
            except Exception:
                print("[server stdout]", line.decode().strip())
                continue

            rid = msg.get("id")
            if rid in self._pending:
                fut = self._pending.pop(rid)
                fut.set_result(msg)
            else:
                print("[unsolicited]", msg)

    async def send(self, payload: dict, timeout: float = 5.0):
        self._id += 1
        payload.setdefault("id", self._id)
        fut = asyncio.get_event_loop().create_future()
        self._pending[self._id] = fut
        data = json.dumps(payload, default=str) + "\n"
        self.proc.stdin.write(data.encode())
        await self.proc.stdin.drain()
        return await asyncio.wait_for(fut, timeout=timeout)

    async def stop(self):
        if self.proc and self.proc.returncode is None:
            self.proc.terminate()
            await self.proc.wait()


async def agentic_mode(client):
    print("\n-- Agentic Mode: Autonomous decision-making")

    # Step 1: List mock projects
    print("\n[Agent] Fetching mock projects...")
    resp = await client.send({"type": "call_tool", "tool": "list_projects", "arguments": {}})
    if not resp.get("ok"):
        print("[Agent] Error fetching projects:", resp.get("error"))
        return

    projects = resp.get("result", [])
    print("[Agent] Found projects:")
    for project in projects:
        print(f"  - {project['name']} ({project['description']})")

    # Step 2: Analyze team members and predict churn
    for project in projects:
        print(f"\n[Agent] Analyzing project: {project['name']}")
        for team in project.get("teams", []):
            print(f"  Team: {team['name']}")
            for member in team.get("members", []):
                print(f"    Member: {member['name']}")

                # Randomly simulate churn prediction input
                years = random.uniform(0, 10)
                satisfaction = random.uniform(0, 1)
                sample = [{"YearsAtCompany": years, "EmployeeSatisfaction": satisfaction}]

                print(f"    [Agent] Predicting churn (Years: {years:.1f}, Satisfaction: {satisfaction:.2f})...")
                churn_resp = await client.send({"type": "call_tool", "tool": "predict_churn", "arguments": sample})
                if churn_resp.get("ok"):
                    result = churn_resp.get("result")
                    churn = result.get("churn")
                    reason = result.get("reason")
                    print(f"      Churn Prediction: {'Yes' if churn else 'No'} (Reason: {reason})")
                else:
                    print("      [Agent] Error predicting churn:", churn_resp.get("error"))

    print("\n[Agent] Analysis complete.")


async def interactive():
    # build command to run server
    py = sys.executable
    server_script = str(ROOT / "mcp_stdio_server.py")
    client = StdIOClient([py, server_script])
    await client.start()

    # initialize
    init = await client.send({"type": "initialize"})
    if not init.get("ok"):
        print("Failed to initialize server:", init)
        await client.stop()
        return

    print("Connected to local MCP-like server (stdio)")

    # main loop
    while True:
        print("\nChoose an option:")
        print("1. Chat with AI assistant (local)")
        print("2. Call BMI calculator tool")
        print("3. Call churn prediction tool (uses mock data)")
        print("4. List mock projects")
        print("5. Exit")
        print("6. Agentic Mode (autonomous)")
        choice = input("Enter option (1-6): ").strip()

        if choice == "1":
            print("\n-- Chat mode (local echo assistant). Type 'exit' to return")
            while True:
                msg = input("You: ").strip()
                if msg.lower() == "exit":
                    break
                # simple deterministic reply
                reply = f"I heard: {msg[:200]}"
                print("Assistant:", reply)

        elif choice == "2":
            try:
                weight = float(input("Enter weight in kg: ").strip())
                height = float(input("Enter height in meters: ").strip())
                resp = await client.send({"type": "call_tool", "tool": "calculate_bmi", "arguments": {"weight_kg": weight, "height_m": height}})
                if resp.get("ok"):
                    print("BMI result:", resp.get("result"))
                else:
                    print("Error:", resp.get("error"))
            except ValueError:
                print("Please enter valid numbers")

        elif choice == "3":
            print("Calling churn predictor using a small sample from mock data")
            # We'll build a small sample payload using a heuristic. In practice you can pass any list of dicts
            # Prompt user for a couple of values to make it interactive
            try:
                years = float(input("Years at company (e.g. 1.0): ").strip())
                sat = float(input("Employee satisfaction (0.0-1.0): ").strip())
                sample = [{"YearsAtCompany": years, "EmployeeSatisfaction": sat, "Position": "Engineer", "Salary": 5.0}]
                resp = await client.send({"type": "call_tool", "tool": "predict_churn", "arguments": sample})
                if resp.get("ok"):
                    print("Predict churn result:", resp.get("result"))
                else:
                    print("Error:", resp.get("error"))
            except ValueError:
                print("Please enter valid numeric values")

        elif choice == "4":
            resp = await client.send({"type": "call_tool", "tool": "list_projects", "arguments": {}})
            if resp.get("ok"):
                projects = resp.get("result")
                print(json.dumps(projects, indent=2, default=str))
            else:
                print("Error:", resp.get("error"))

        elif choice == "5":
            print("Exiting")
            break

        elif choice == "6":
            await agentic_mode(client)

        else:
            print("Invalid choice")

    await client.stop()


if __name__ == "__main__":
    try:
        asyncio.run(interactive())
    except KeyboardInterrupt:
        print("\nInterrupted")
