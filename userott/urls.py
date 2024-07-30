from django.urls import path
from userott import views

urlpatterns = [
     path('listvideo', views.Listvideo, name='listvideo'),
    path('listplans',views.Listplan,name='listplans'),
    path('viewvideo/<int:pk>',views.viewvideo,name='viewvideo'),
    path('viewplan/<int:pk>',views.viewplan,name='viewplan'),
     path('signup',views.signup,name='signup'),
    path('login', views.login, name='login'),
    path('logoutuser',views.logoutuser,name='logout'),
    path('subscribe/',views.Subscriptions,name='subscribe'),
     path('check_subscription', views.check_subscription, name='check_subscription'),
    path('current_plan', views.current_plan, name='current_plan'),
]