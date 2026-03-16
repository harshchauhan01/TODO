from django.urls import path
from .views import *

urlpatterns=[
    path('',home),
    path('users/',users),
    path('add/',create_todo,name="create_todo"),
]