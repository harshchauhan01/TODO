from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from .models import Task
import json

@api_view(['Get'])
def home(request):
    return Response("Hello This is home page.")

@api_view(['Get'])
def users(request):
    data = [
        {"id":1,"name":"Rahul"},
        {"id":2,"name":"Aman"},
        {"id":3,"name":"John"}
    ]
    return Response(data)

def create_todo(request):
    if request.method=="POST":
        data=json.loads(request.body)
        todo = Task.objects.create(
            title=data.get('title'),
            content=data.get('content'),
            priority=data.get('priority'),
            due_date=data.get('due_date'),
        )
        return JsonResponse({
            "message":"Todo created successfully",
            "id":todo.id
        })
    return JsonResponse({"error":"POST request required"})