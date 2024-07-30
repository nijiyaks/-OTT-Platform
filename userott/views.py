from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from newapp.models import videomdl, planmdl,Subscription
from .serializers import VideoSerializer,PlanSerializer,SubscriptionSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.authtoken.models import Token
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from rest_framework.status import HTTP_403_FORBIDDEN

from django.contrib.auth import authenticate

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q



class ExtendedUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phonenumber = forms.CharField(max_length=15, required=True)

    class Meta(UserCreationForm.Meta):
        fields = UserCreationForm.Meta.fields + ('email', 'phonenumber',)

from newapp.models import Profile  
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    phonenumber = request.data.get('phonenumber')
   
    if not (username and email and password):
        return Response({"error": "Username, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create a new User instance with hashed password
        user = User.objects.create_user(username=username, email=email, password=password)

        # Create a new Profile instance linked to the User
        profile = Profile.objects.create(user=user, phonenumber=phonenumber, email=email, username=username, password=password)

        return Response("Account created successfully", status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    



@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")

    if username is None or password is None or email is None:
        return Response({'error': 'Please provide username, email, and password'},
                        status=HTTP_400_BAD_REQUEST)
    
    # Authenticate user
    user = authenticate(username=username, email=email, password=password)

    if not user:
        return Response({'error': 'Invalid Credentials'}, status=HTTP_404_NOT_FOUND)

    
    try:
        profile = Profile.objects.get(user=user)
        if profile.blocked:
            return Response(status=HTTP_404_NOT_FOUND)
    except Profile.DoesNotExist:
        pass 
    token, _ = Token.objects.get_or_create(user=user)

   
    return Response({'id': user.id, 'username': user.username, 'email': user.email, 'token': token.key}, status=HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logoutuser(request):
    if request.method == 'POST':
        request.user.auth_token.delete()
        return Response({'Message': 'You are logged out'},status=status.HTTP_200_OK)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def Listvideo(request):
    try:
        search_query = request.GET.get('search', '')
        page = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 3)

        videos = videomdl.objects.filter(Q(title__icontains=search_query))

        paginator = Paginator(videos, page_size)
        try:
            videos_page = paginator.page(page)
        except PageNotAnInteger:
            videos_page = paginator.page(1)
        except EmptyPage:
            videos_page = paginator.page(paginator.num_pages)

        serializer = VideoSerializer(videos_page, many=True)
        return Response({
            'videos': serializer.data,
            'page': page,
            'total_pages': paginator.num_pages
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)








# @api_view(['GET'])
# @permission_classes([AllowAny])
# def Listvideo(request):
#     products = videomdl.objects.all()
#     serializer = VideoSerializer(products, many=True)
#     return Response(serializer.data)







@api_view(['GET'])
@permission_classes([IsAuthenticated])
def viewvideo(request, pk):
    try:
        user = request.user
        now = datetime.now()
        active_subscription = Subscription.objects.filter(user=user, ExpiryDate__gt=now).exists()

        if not active_subscription:
            return Response({'error': 'You need an active subscription to view this video.'}, status=status.HTTP_404_NOT_FOUND)

        product = videomdl.objects.get(pk=pk)
        serializer = VideoSerializer(product)
        return Response(serializer.data)
    except videomdl.DoesNotExist:
        return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def Listplan(request):
    products = planmdl.objects.all()
    serializer = PlanSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes((AllowAny,))
def viewplan(request, pk):
    try:
        product = planmdl.objects.get(pk=pk)
        serializer =PlanSerializer(product)
        return Response(serializer.data)
    except planmdl.DoesNotExist:
        return Response({'error': 'plan not found'}, status=status.HTTP_404_NOT_FOUND)
    


from datetime import datetime

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Subscriptions(request):
    user = request.user
    active_subscription = Subscription.objects.filter(user=user, ExpiryDate__gt=timezone.now()).exists()  #checking
    if active_subscription:
        return Response({'error': 'User already has an active subscription.'}, status=400)

    print("Request Data:", request.data) 

    # Make a copy of request data and add the user to it
    data = request.data.copy()
    data['user'] = user.id

    # Ensure that the plan ID is present in the request data
    plan_id = data.get('plan')
    if not plan_id:
        return Response({'error': 'Plan is required.'}, status=400)

    try:
        plan = planmdl.objects.get(id=plan_id)
    except planmdl.DoesNotExist:
        return Response({'error': 'Plan does not exist.'}, status=404)

    serializer = SubscriptionSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=user, plan=plan)  
        return Response(serializer.data, status=201)
    else:
        print("Serializer Errors:", serializer.errors)  
        return Response(serializer.errors, status=400)


from django.utils import timezone

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_subscription(request):
    user = request.user
    now = timezone.now()
    has_active_subscription = Subscription.objects.filter(user=user, ExpiryDate__gt=now).exists()
    return Response({'has_active_subscription': has_active_subscription})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_plan(request):
    user = request.user
    now = timezone.now()
    try:
        current_subscription = Subscription.objects.get(user=user, ExpiryDate__gt=now)
        serializer = SubscriptionSerializer(current_subscription)
        return Response(serializer.data)
    except Subscription.DoesNotExist:
        return Response({'error': 'No active subscription found.'}, status=404)
    except Exception as e:
        print(f"Error fetching current plan: {e}")
        return Response({'error': 'An error occurred while fetching the plan.'}, status=500)



