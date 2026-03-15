from django.db import models

# Create your models here.
class Task(models.Model):
    title = models.CharField(max_length=200)
    content=models.TextField()
    completed=models.BooleanField(default=False)
    priority=models.IntegerField(default=1)
    due_date=models.DateTimeField(null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    class Meta:
        ordering=['-created_at']

    def __str__(self):
        return self.title