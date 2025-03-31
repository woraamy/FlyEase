from app.tools.search import perform_Web_Search

def search_web(state):
    """Perform web search"""
    if not isinstance(state.get("messages"), list):
        if isinstance(state.get("messages"), str):
            query = state["messages"]
        else:
            query = ""
    else:
        last_message = state["messages"][-1]
        query = last_message.content if hasattr(last_message, "content") else str(last_message)

    search_results = perform_Web_Search(query)
    return {**state, "search_results": search_results}