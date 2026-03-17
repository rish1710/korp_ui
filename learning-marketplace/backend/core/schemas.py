import json
from pydantic import BaseModel, Field
from typing import List
from typing_extensions import Literal

class CourseSuggestion(BaseModel):
    title: str = Field(description="The title of the suggested micro-course.")
    description: str = Field(description="A brief description of what the course covers based on the uploaded documents.")
    difficulty: Literal["Beginner", "Intermediate", "Advanced"] = Field(description="The estimated difficulty level.")
    estimated_minutes: int = Field(description="Estimated time to complete the course in minutes.")

class CourseSuggestionResponse(BaseModel):
    suggestions: List[CourseSuggestion] = Field(description="A list of exactly 3 course suggestions derived from the document content.")
    
# We will use this model to strictly enforce OpenAI structured outputs
