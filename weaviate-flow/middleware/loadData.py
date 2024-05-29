import weaviate
import pandas as pd
import requests
from datetime import datetime, timezone
import json
from weaviate.util import generate_uuid5
from tqdm import tqdm
import os


async def importData(client):
    file_path = "/teamspace/studios/this_studio/middleware/fruitData.json"
    with open(file_path, 'r') as file:
        data = json.load(file)
        print(data)
    df = pd.DataFrame(data)
    print(df)
    fruits = client.collections.get("Fruits")

    with fruits.batch.rate_limit(48) as batch:
        for i, fruits in tqdm(df.iterrows()):
            fruit_obj = {
                "name": fruits["name"],
                "fruit_id": fruits["id"],
                "family": fruits["family"],
                "order": fruits["order"],
                "genus": fruits["genus"],
                "calories": fruits["nutritions"]["calories"],
                "fat": fruits["nutritions"]["fat"],
                "sugar": fruits["nutritions"]["sugar"],
                "carbohydrates": fruits["nutritions"]["carbohydrates"],
                "protein": fruits["nutritions"]["protein"],
            }
            batch.add_object(
                properties=fruit_obj,
                uuid=generate_uuid5(fruits["id"])
            )
    client.close()
    if len(fruits.batch.failed_objects) > 0:
        print(f"Failed to import {len(movies.batch.failed_objects)} objects")
    else:
        print("Successful")