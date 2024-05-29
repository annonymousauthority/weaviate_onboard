import weaviate

import weaviate.classes.config as wc
import pandas as pd
import requests
from datetime import datetime, timezone
import json
from weaviate.util import generate_uuid5
from tqdm import tqdm

async def dataModel(client):
    print("Get in here...")
    try:
        collection = client.collections.create(
            name="Fruits",
            properties=[
                wc.Property(name="name", data_type=wc.DataType.TEXT),
                wc.Property(name="fruit_id", data_type=wc.DataType.NUMBER),
                wc.Property(name="family", data_type=wc.DataType.TEXT),
                wc.Property(name="order", data_type=wc.DataType.TEXT),
                wc.Property(name="genus", data_type=wc.DataType.TEXT),
                wc.Property(name="calories", data_type=wc.DataType.NUMBER),
                wc.Property(name="fat", data_type=wc.DataType.NUMBER),
                wc.Property(name="sugar", data_type=wc.DataType.NUMBER),
                wc.Property(name="carbohydrates", data_type=wc.DataType.NUMBER),
                wc.Property(name="protein", data_type=wc.DataType.NUMBER),
            ],

            vectorizer_config=wc.Configure.Vectorizer.text2vec_openai(),

            generative_config=wc.Configure.Generative.openai()
        )
        print(collection)
    finally:
        print("Completed")