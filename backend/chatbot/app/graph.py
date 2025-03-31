from langgraph.graph import StateGraph, START, END
from app.nodes.query_processor import store_query
from app.nodes.context_retriever import retrieve_context
from app.nodes.search_node import search_web
from app.nodes.response_generator import generate_final_response
from typing import List, Dict, Optional, TypedDict, Any
from typing_extensions import TypedDict, Annotated
from langchain_core.messages import BaseMessage
from app.models.state import State

# Create graph
graph = StateGraph(State)

# Add nodes
graph.add_node("store_query", store_query)
graph.add_node("retrieve_context", retrieve_context)
graph.add_node("search_web", search_web)
graph.add_node("generate_response", generate_final_response)

# Define edges
graph.add_edge(START, "store_query")
graph.add_edge("store_query", "retrieve_context")
graph.add_edge("retrieve_context", "search_web")
graph.add_edge("search_web", "generate_response")
graph.add_edge("generate_response", END)

graph_app = graph.compile()

