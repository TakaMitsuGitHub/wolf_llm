
from django.contrib import admin
from django.urls import path, include
from django.urls import path
from .scenario.views import ChapterGroupView
from .scenario.views import LLMGenerateGroupView

urlpatterns = [
    path("api/chapters/group/", ChapterGroupView.as_view()),
    path("api/llm/generate_group/", LLMGenerateGroupView.as_view()),
]
