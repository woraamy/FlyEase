import datetime
import uuid
from typing import Dict, Any, List

# Use the older PGVector implementation
from langchain.vectorstores.pgvector import PGVector
from langchain_huggingface import HuggingFaceEmbeddings

# Constants
COLLECTION_NAME = "flights"
CONNECTION_STRING = "postgresql+psycopg2://postgres:test@localhost:6543/vector_db"

def store_query_in_vector_db(query: str, response: str = None, metadata: Dict[str, Any] = None):
    """Store user query and response in vector database with metadata"""
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    item_id = str(uuid.uuid4())

    if metadata is None:
        metadata = {}

    if "timestamp" not in metadata:
        metadata["timestamp"] = datetime.datetime.now().isoformat()

    text_to_embed = response if response and metadata.get("is_response") else query

    try:
        # Use the older PGVector implementation
        vector_store = PGVector(
            connection_string=CONNECTION_STRING,
            collection_name=COLLECTION_NAME,
            embedding_function=embeddings  # Use embedding_function for older version
        )

        # Add texts with metadata
        vector_store.add_texts(
            texts=[text_to_embed],
            metadatas=[metadata],
            ids=[item_id]
        )

        print(f"Successfully stored in vector DB with ID: {item_id}")
        return item_id
    except Exception as e:
        print(f"Error storing in vector DB: {e}")
        return None

def retrieve_similar_contexts(query: str, top_k: int = 3):
    """Retrieve similar contexts from vector database"""
    try:
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

        # Use the older PGVector implementation
        vector_store = PGVector(
            connection_string=CONNECTION_STRING,
            collection_name=COLLECTION_NAME,
            embedding_function=embeddings  # Use embedding_function for older version
        )

        results = vector_store.similarity_search_with_score(query, k=top_k)

        contexts = []
        for doc, score in results:
            contexts.append({
                "content": doc.page_content,
                "metadata": doc.metadata,
                "similarity_score": score
            })

        return contexts
    except Exception as e:
        print(f"Error retrieving similar contexts: {e}")
        return []