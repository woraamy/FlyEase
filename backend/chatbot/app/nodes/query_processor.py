import uuid
from langchain_core.messages import HumanMessage
from app.tools.vector_db import store_query_in_vector_db

def store_query(state):
    """Store the query in vector DB"""
    if not isinstance(state.get("messages"), list):
        if isinstance(state.get("messages"), str):
            query = state["messages"]
            state = {**state, "messages": [HumanMessage(content=query)]}
        else:
            query = ""
            state = {**state, "messages": [HumanMessage(content=query)]}
    else:
        last_message = state["messages"][-1]
        query = last_message.content if hasattr(last_message, "content") else str(last_message)

    session_id = state.get("session_id", str(uuid.uuid4()))

    query_id = store_query_in_vector_db(
        query=query,
        metadata={"session_id": session_id, "initial_query": True}
    )

    return {**state, "session_id": session_id, "query_id": query_id}