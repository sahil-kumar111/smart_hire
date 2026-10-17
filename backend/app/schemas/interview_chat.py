from pydantic import BaseModel


class InterviewChatRequest(BaseModel):

    message: str


class InterviewChatResponse(BaseModel):

    reply: str

    interview_finished: bool