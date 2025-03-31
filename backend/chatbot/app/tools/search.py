from typing import List, Dict
from langchain_community.utilities.tavily_search import TavilySearchAPIWrapper
from app.tools.config import TAVILY_API_KEY

def perform_Web_Search(query: str, max_results: int = 3):
    """Perform web search using Tavily API"""
    try:
        search = TavilySearchAPIWrapper(api_key=TAVILY_API_KEY)
        results = search.results(query, max_results=max_results)
        return results
    except Exception as e:
        print(f"Error performing web search: {e}")
        return []