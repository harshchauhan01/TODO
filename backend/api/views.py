import json
from .models import Task
from .serializers import *
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework import filters, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated



@api_view(['Get'])
def home(request):
    return Response("Hello This is home page.")


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class=RegisterSerializer


class TodoViewSet(ModelViewSet):
    permission_classes=[IsAuthenticated]
    queryset=Task.objects.all().order_by('priority','due_date')
    serializer_class=TodoSerializer
    filter_backends=[filters.SearchFilter]
    search_fields=['title']

    @action(detail=True,methods=["post"])
    def mark_complete(self,request,pk=None):
        todo=self.get_object()
        todo.completed=not todo.completed
        todo.save()
        return Response({"status":"completed"})

