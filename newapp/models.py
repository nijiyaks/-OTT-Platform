
from django.db import models
from django.utils import timezone
import random
from django.contrib.auth.models import User
from django.db import models
from datetime import timedelta



class planmdl(models.Model):
    title=models.CharField(max_length=150)
    duration = models.IntegerField(default='')
    description = models.TextField(max_length=1200)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    uploaddate =models.DateTimeField(auto_now_add=True)

class videomdl(models.Model):
    title = models.CharField(max_length=150)
    thumbnail = models.ImageField(upload_to='thumbnails/')  
    video_file = models.FileField(upload_to='videos/')
    description = models.TextField(max_length=1200)
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phonenumber = models.CharField(max_length=12)  
    email = models.EmailField('') 
    username = models.CharField(max_length=150)  
    password = models.CharField(max_length=128)  
    blocked = models.BooleanField(default=False)
    def __str__(self):
        return self.user.username
    def is_user_subscribed(self, user):
        # Check if the user has an active subscription to any plan associated with this video
        return Subscription.objects.filter(user=user, plan__videomdl=self).exists()

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(planmdl, on_delete=models.CASCADE)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    order_id = models.CharField(max_length=10, unique=True, default='')
    ExpiryDate = models.DateTimeField(blank=True, null=True)
    def save(self, *args, **kwargs):
        if not self.id:
            while True:
                order_id = ''.join(random.choices('0123456789', k=8))
                if not Subscription.objects.filter(order_id=order_id).exists():
                    self.order_id = order_id
                    break

        if self.plan and self.plan.duration is not None:
            if not self.subscribed_at:
                self.subscribed_at = timezone.now()  # Set current time if subscribed_at is None

            self.ExpiryDate = self.subscribed_at + timedelta(days=self.plan.duration)
        else:
            self.ExpiryDate = timezone.now()  # Default to current time if plan or duration is not available

        super().save(*args, **kwargs)

    def is_active(self):
        return self.ExpiryDate > timezone.now()


