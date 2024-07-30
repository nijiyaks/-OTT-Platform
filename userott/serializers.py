from rest_framework import serializers
from newapp.models import videomdl,planmdl,Subscription
from rest_framework.serializers import ModelSerializer


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = videomdl
        fields = '__all__'


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
         model = planmdl
         fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'user', 'plan', 'subscribed_at', 'ExpiryDate']
