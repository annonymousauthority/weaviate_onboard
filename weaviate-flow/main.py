import weaviate
import os
import json
from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from middleware.dataCollection import dataModel
from middleware.loadData import importData
from middleware.basicSearch import performSearch
import asyncio
from pydantic import BaseModel
from dotenv import load_dotenv
from middleware.infologger import setup_logger
from logging import getLogger
# Load environment variables from .env file
load_dotenv()
app = FastAPI()

setup_logger()

debug_logger = getLogger("debug_logger")
info_logger = getLogger("info_logger")
error_logger = getLogger("error_logger")

origins = [
    "http://localhost:3000",
    "https://8000-01hyx63njjxbnwr3yyf23mkzdw.cloudspaces.litng.ai"
]


# Add CORS middleware to the FastAPI app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai_api_key = os.getenv("OPENAI_APIKEY")
wcs_demo_url = os.getenv("WCS_DEMO_URL")
wcs_demo_admin_key = os.getenv("WCS_DEMO_ADMIN_KEY")
headers = {"X-OpenAI-Api-Key":openai_api_key} 
client = weaviate.Client(
    url=wcs_demo_url,
    auth_client_secret=weaviate.auth.AuthApiKey(
        api_key=wcs_demo_admin_key
    ),
)
cl = weaviate.connect_to_wcs(cluster_url=wcs_demo_url, auth_credentials=weaviate.auth.AuthApiKey(api_key=wcs_demo_admin_key), headers=headers)

@app.on_event("startup")
def onStartup():
    if client.is_live():
        print("Connected to Weaviate successfully.")
        cl = weaviate.connect_to_wcs(cluster_url=wcs_demo_url, auth_credentials=weaviate.auth.AuthApiKey(api_key=wcs_demo_admin_key), headers=headers)
    else:
        print("Failed to connect to weaviate")

@app.on_event("shutdown")
def onShutdown():
    cl.close()

class SearchRequest(BaseModel):
    query: str

@app.post("/performsearch")
async def basicSearch(request: SearchRequest):
    try:
        res = performSearch(client=cl, query=request.query)
        info_logger(f"Incoming request: {request}")
        info_logger(f"Response: {res}")
        return res
    except Exception as e:
        error_logger(f"Error occurred: {e}")
        return {"error": str(e)}, 500

@app.get("/")
async def getStarted():
    return {"Message":"Everything is alright"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info")