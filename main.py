import weaviate
import os
import json
from fastapi import FastAPI
import uvicorn
from middleware.dataCollection import dataModel
from middleware.loadData import importData
from middleware.basicSearch import performSearch
import asyncio
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
app = FastAPI()

openai_api_key = os.getenv("OPENAI_APIKEY")
wcs_demo_url = os.getenv("WCS_DEMO_URL")
wcs_demo_admin_key = os.getenv("WCS_DEMO_ADMIN_KEY")

@app.on_event("startup")
def onStartup():
    headers = {"X-OpenAI-Api-Key":openai_api_key} 
    client = weaviate.Client(
        url=wcs_demo_url,
        auth_client_secret=weaviate.auth.AuthApiKey(
            api_key=wcs_demo_admin_key
        ),
    )
    if client.is_live():
        print("Connected to Weaviate successfully.")
        cl = weaviate.connect_to_wcs(cluster_url=wcs_demo_url, auth_credentials=weaviate.auth.AuthApiKey(api_key=wcs_demo_admin_key), headers=headers)
    else:
        print("Failed to connect to weaviate")

@app.on_event("shutdown")
def onShutdown():
    headers = {"X-OpenAI-Api-Key":openai_api_key} 
    cl = weaviate.connect_to_wcs(cluster_url=wcs_demo_url, auth_credentials=weaviate.auth.AuthApiKey(api_key=wcs_demo_admin_key), headers=headers)
    cl.close()

class SearchRequest(BaseModel):
    query: str

@app.post("/performsearch")
async def basicSearch(request: SearchRequest):
    headers = {"X-OpenAI-Api-Key":openai_api_key} 
    cl = weaviate.connect_to_wcs(cluster_url=wcs_demo_url, auth_credentials=weaviate.auth.AuthApiKey(api_key=wcs_demo_admin_key), headers=headers)
    res = performSearch(client=cl, query=request.query)
    return res

@app.get("/")
async def getStarted():
    return {"Message":"Everything is alright"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, log_level="info")