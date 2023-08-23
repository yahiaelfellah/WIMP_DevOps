from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Access environment variables
db_url = os.getenv("DB_URL")
db_name = os.getenv("DB_NAME")
collection_name = os.getenv("COLLECTION_NAME")


class MongoDBModule:
    def __init__(self):
        self.client = MongoClient(db_url)
        self.db = self.client[db_name]

    def insert_document(self, document):
        collection = self.db[collection_name]
        result = collection.insert_one(document)
        return result.inserted_id

    def find_documents(self, query=None):
        collection = self.db[collection_name]
        if query is None:
            documents = collection.find()
        else:
            documents = collection.find(query)
        return list(documents)

    def update_document(self, query, update):
        collection = self.db[collection_name]
        update = {"$set": update}

        result = collection.update_one(query, update)
        return result.modified_count

    def delete_document(self, query):
        collection = self.db[collection_name]
        result = collection.delete_one(query)
        return result.deleted_count

    def close_connection(self):
        self.client.close()


# Example usage
if __name__ == "__main__":
    db_module = MongoDBModule()

    # Insert a document
    new_document = {"name": "John", "age": 30}
    inserted_id = db_module.insert_document(new_document)
    print("Inserted document with ID:", inserted_id)

    # Find documents
    documents = db_module.find_documents()
    print("All documents:")
    for doc in documents:
        print(doc)

    # Update a document
    update_query = {"name": "John"}
    update_data = {"age": 31}
    modified_count = db_module.update_document(
         update_query, update_data)
    print("Modified documents count:", modified_count)

    # Delete a document
    delete_query = {"name": "John"}
    deleted_count = db_module.delete_document(delete_query)
    print("Deleted documents count:", deleted_count)

    db_module.close_connection()
