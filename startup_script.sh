#!/bin/bash
cd weaviate-flow
uvicorn main:app --host 0.0.0.0 --port 8000 --log-level info --reload
