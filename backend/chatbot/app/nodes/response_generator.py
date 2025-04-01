import datetime
from langchain_core.messages import AIMessage
from app.tools.llm import generate_response
from app.tools.vector_db import store_query_in_vector_db

def generate_final_response(state):
    """Generate final response"""
    if isinstance(state.get("messages"), list) and len(state["messages"]) > 0:
        last_message = state["messages"][-1]
        query = last_message.content if hasattr(last_message, "content") else str(last_message)
    else:
        query = ""

    similar_contexts = state.get("similar_contexts", [])
    search_results = state.get("search_results", [])

    response = generate_response(query, contexts=similar_contexts)

    store_query_in_vector_db(
        query=query,
        response=response,
        metadata={
            "session_id": state.get("session_id"),
            "similar_contexts": [ctx.get("metadata", {}).get("uuid") for ctx in similar_contexts],
            "search_results": search_results,
            "final_response": True,
            "timestamp": datetime.datetime.now().isoformat(),
            "response_type": "final",
            "query_vector_id": state.get("query_id")
        }
    )

    new_message = AIMessage(content=response)
    return {"messages": state["messages"] + [new_message]}