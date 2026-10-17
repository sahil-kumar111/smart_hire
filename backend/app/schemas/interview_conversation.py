from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ConversationMessageCreate(BaseModel):
    session_id: int
    role: str
    message: str


class ConversationRequest(BaseModel):
    session_id: int
    answer: str


class ConversationMessageResponse(BaseModel):
    id: int
    session_id: int
    role: str
    message: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ConversationHistoryResponse(BaseModel):
    session_id: int
    messages: list[ConversationMessageResponse]


class StartInterviewResponse(BaseModel):
    session_id: int
    message: str


class ChatResponse(BaseModel):
    reply: str
    interview_completed: bool = False


class EndInterviewResponse(BaseModel):
    session_id: int
    status: str
    total_messages: int