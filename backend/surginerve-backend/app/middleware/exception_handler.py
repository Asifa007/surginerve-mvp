"""
SurgiNerve – Global exception-handling middleware
"""
import logging
import traceback

from fastapi import Request
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    tb = traceback.format_exc()
    logger.error("Unhandled exception on %s %s\n%s", request.method, request.url.path, tb)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "path": str(request.url.path)},
    )
