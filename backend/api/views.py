from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


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