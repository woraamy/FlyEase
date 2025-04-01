from app.tools.vector_db import retrieve_similar_contexts

def retrieve_context(state):
    """Retrieve similar contexts"""
    if not isinstance(state.get("messages"), list):
        if isinstance(state.get("messages"), str):
            query = state["messages"]
        else:
            query = ""
    else:
        last_message = state["messages"][-1]
        query = last_message.content if hasattr(last_message, "content") else str(last_message)

    similar_contexts = retrieve_similar_contexts(query)
    return {**state, "similar_contexts": similar_contexts}