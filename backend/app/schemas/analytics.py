from pydantic import BaseModel


class SearchQueryMetric(BaseModel):
    query: str
    count: int


class AnalyticsOut(BaseModel):
    total_users: int
    total_tasks: int
    pending_tasks: int
    completed_tasks: int
    total_documents: int
    total_activity_logs: int
    total_searches: int
    most_searched_queries: list[SearchQueryMetric]
