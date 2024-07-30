
from django.contrib import admin
from django.urls import path,include
from newapp import views

from django.conf import settings

from django.conf.urls.static import static

urlpatterns = [
    # path('admin/', admin.site.urls),
     path('', views.login_views, name='login_view'),
    path('login/', views.login_views, name='login_view'),
        path('logout/', views.logout_view, name='logout_view'),
    path('createvideo', views.createvideo, name='createvideo'),
    path('videolists', views.video_lists, name='videolists'),
     path('videoedit/<int:pk>', views.video_edit, name='editvideo'),
    path('deletevideo /<int:pk>', views.deletevideo, name='deletevideo'),
path('search/',views.search_products,name='search_products'),
         path('live-search/', views.live_search, name='live_search'),

    path('createplan', views.createplan, name='createplan'),
    path('planlists', views.planlists, name='planlists'),
     path('planedit/<int:pk>', views.planedit, name='planedit'),
     path('deleteplan/<int:pk>', views.deleteplan, name='deleteplan'),
    path('reveniew', views.reveniew, name='reveniew'),
    path('subscriberlist',views.subscriberlist,name='subscriberlist'),
          path('userlists', views.userlists, name='userlists'),
    path('blockuser/<int:user_id>/',views.toggle_block_user,name='blockuser'),

    
    path('api/',include('userott.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
