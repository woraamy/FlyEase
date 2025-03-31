from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import uuid
import traceback
from app.graph import graph_app
from app.tools.vector_db import store_query_in_vector_db

app = FastAPI(title="LangGraph Query API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    session_id: Optional[str] = None

class QueryResponse(BaseModel):
    response: str
    session_id: str
    similar_contexts: Optional[List[Dict[str, Any]]] = None
    search_results: Optional[List[Dict[str, Any]]] = None

@app.post("/api/query", response_model=QueryResponse)
async def process_query(request: QueryRequest):
    try:
        # Generate session_id if not provided
        session_id = request.session_id or str(uuid.uuid4())

        # Store the initial query
        query_id = None
        try:
            query_id = store_query_in_vector_db(
                query=request.query,
                metadata={
                    "session_id": session_id,
                    "initial_query": True
                }
            )
            print(f"Stored initial query in vector DB with ID: {query_id}")
        except Exception as store_error:
            print(f"Error storing initial query: {store_error}")
            print(traceback.format_exc())

        # Initialize state with the query
        initial_state = {
            "messages": request.query,
            "session_id": session_id,
            "query_id": query_id
        }

        # Run the graph
        result = graph_app.invoke(initial_state)

        # Extract response from the last message
        if result.get("messages") and len(result["messages"]) > 0:
            response_text = result["messages"][-1].content
        else:
            response_text = "No response generated"

        # Store the final response
        try:
            response_id = store_query_in_vector_db(
                query=request.query,
                response=response_text,
                metadata={
                    "session_id": session_id,
                    "similar_contexts": result.get("similar_contexts", []),
                    "search_results": result.get("search_results", []),
                    "final_response": True,
                    "response_type": "final",
                    "query_vector_id": query_id
                }
            )
            print(f"Stored final response in vector DB with ID: {response_id}")
        except Exception as store_error:
            print(f"Error storing final response: {store_error}")
            print(traceback.format_exc())

        return QueryResponse(
            response=response_text,
            session_id=session_id,
            similar_contexts=result.get("similar_contexts"),
            search_results=result.get("search_results")
        )
    except Exception as e:
        print(f"Error processing query: {e}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)