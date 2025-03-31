import datetime
import uuid
from typing import Dict, Any, List

from langchain_community.vectorstores.pgvector import PGVector
from langchain_huggingface import HuggingFaceEmbeddings

from app.tools.config import CONNECTION_POSTGRES, COLLECTION_NAME

def store_query_in_vector_db(query: str, response: str = None, metadata: Dict[str, Any] = None):
    """Store user query and response in vector database with metadata"""
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    item_id = str(uuid.uuid4())

    if metadata is None:
        metadata = {}

    if "timestamp" not in metadata:
        metadata["timestamp"] = datetime.datetime.now().isoformat()

    text_to_embed = response if response and metadata.get("is_response") else query

    document_data = {
        "uuid": item_id,
        "query": query,
        "document": response if response else "",
        "cmetadata": metadata,
        "custom_id": metadata.get("session_id", item_id)
    }

    try:
        vector_store = PGVector(
            connection_string=CONNECTION_POSTGRES,
            collection_name=COLLECTION_NAME,
            embedding_function=embeddings
        )

        vector_store.add_texts(
            texts=[text_to_embed],
            metadatas=[document_data],
            ids=[item_id]
        )

        return item_id
    except Exception as e:
        print(f"Error storing in vector DB: {e}")
        return None

def retrieve_similar_contexts(query: str, top_k: int = 3):
    """Retrieve similar contexts from vector database"""
    try:
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vector_store = PGVector(
            connection_string=CONNECTION_POSTGRES,
            collection_name=COLLECTION_NAME,
            embedding_function=embeddings
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