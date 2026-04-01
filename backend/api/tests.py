from datetime import timedelta

from django.contrib.auth.models import User
from django.test import TestCase
from django.utils import timezone

from .models import Task
from .serializers import TodoSerializer


class TaskExpiryTests(TestCase):
	def setUp(self):
		self.user = User.objects.create_user(username="tester", password="pass12345")

	def test_task_is_expired_when_due_date_passed_and_not_completed(self):
		task = Task.objects.create(
			user=self.user,
			title="Expired task",
			content="Should be expired",
			completed=False,
			due_date=timezone.now() - timedelta(days=1),
		)

		self.assertTrue(task.is_expired())

	def test_task_is_not_expired_when_completed(self):
		task = Task.objects.create(
			user=self.user,
			title="Done task",
			content="Already completed",
			completed=True,
			due_date=timezone.now() - timedelta(days=1),
		)

		self.assertFalse(task.is_expired())

	def test_serializer_exposes_is_expired_field(self):
		task = Task.objects.create(
			user=self.user,
			title="Serializer task",
			content="Check serializer field",
			completed=False,
			due_date=timezone.now() - timedelta(hours=2),
		)

		serialized = TodoSerializer(task).data
		self.assertIn("is_expired", serialized)
		self.assertTrue(serialized["is_expired"])
