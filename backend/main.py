("""Module entrypoint that exposes the FastAPI ``app`` instance for ASGI servers.
, have the sam 
Uvicorn can load the app with `uvicorn main:app` because this module imports
the `app` instance defined in `app.py`.
""")

from app import app  # re-export the FastAPI instance defined in app.py


if __name__ == "__main__":
	# Allow running this file directly for quick local testing.
	import uvicorn

	uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)

