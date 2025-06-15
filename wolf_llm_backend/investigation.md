# Investigation: `ChapterGroupView.post` not executed

## Observed behavior
- Server log only shows:
  `[15/Jun/2025 23:57:55] "OPTIONS /demo_novel_game/api/chapters/group/ HTTP/1.1" 200 172`
- `print(f"request : {request}")` inside `ChapterGroupView.post` was expected but not printed.

## Cause
- The request hitting the server is an `OPTIONS` preflight request, not a `POST`.
- Django's `APIView.post` method runs only for HTTP `POST` requests.
- Browsers send an `OPTIONS` request before a cross-origin `POST` to check CORS settings. This preflight does not execute view logic.

## Resolution
- Ensure the actual `POST` request is sent after the preflight. If it fails, configure CORS.
- Install and configure `django-cors-headers` or similar so the server responds with appropriate CORS headers and allows the real `POST` request.
- After configuring CORS, verify that a log entry like `"POST /demo_novel_game/api/chapters/group/"` appears. Then the print should execute.
