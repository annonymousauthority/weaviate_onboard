import weaviate.classes.query as wq

def performSearch(client, query):
    fruits = client.collections.get("Fruits")
    response = fruits.query.bm25(
    query=query, limit=5, return_metadata=wq.MetadataQuery(score=True)
)
    print(response)
    res = None
    for o in response.objects:
        res = o.properties
        print(
            o.properties["name"], o.properties["calories"]
        ) 
    
    return res
    client.close()