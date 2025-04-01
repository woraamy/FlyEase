from typing import List, Dict, Optional, TypedDict, Any
from typing_extensions import TypedDict, Annotated
from langchain_core.messages import BaseMessage

class State(TypedDict):
    """State definition for the query processing graph."""
    messages: List[BaseMessage]
    session_id: Optional[str]
    query_id: Optional[str]
    similar_contexts: Optional[List[Dict[str, Any]]]
    search_results: Optional[List[Dict[str, Any]]]
    timestamp: Optional[str]
    processing_steps: Optional[List[str]]
    response_time: Optional[float]
    confidence_score: Optional[float]