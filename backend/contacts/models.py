from django.db import models
from django.contrib.auth.models import User

class Contact(models.Model):
    CATEGORY_CHOICES = [
        ('Personal', 'Personal'),
        ('Work', 'Work'),
        ('Family', 'Family'),
        ('Client', 'Client'),
        ('Friend', 'Friend'),
        ('Other', 'Other'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contacts')
    name = models.CharField(max_length=150)
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=30, blank=True, default='')
    company = models.CharField(max_length=150, blank=True, default='')
    job_title = models.CharField(max_length=150, blank=True, default='')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Personal')
    is_favorite = models.BooleanField(default=False)
    address = models.TextField(blank=True, default='')
    notes = models.TextField(blank=True, default='')
    avatar_color = models.CharField(max_length=50, blank=True, default='indigo')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_favorite', 'name']

    def __str__(self):
        return f"{self.name} ({self.owner.username})"
