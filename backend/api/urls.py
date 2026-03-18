from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter
from django.urls import path,include

router=DefaultRouter()
router.register(r'todo',TodoViewSet)

urlpatterns=[
    path('',home),
    path('users/',users),
    path('',include(router.urls)),
]   