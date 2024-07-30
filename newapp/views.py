from django.shortcuts import render,redirect
from .forms import videoform,planform
from .models import videomdl,planmdl,Subscription,Profile
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q

# adminlogin
def login_views(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('videolists')  # Use named URL patterns for better maintainability
        else:
            return render(request, 'login.html', {'error_message': 'Invalid login'})
    else:
        return render(request, 'login.html')

# LOGOUT PAGE
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return redirect('login_view')
    return render(request, 'navbar.html', {'user': request.user})


def search_products(request):
    query = request.GET.get('query', '')
    if query:
        products = videomdl.objects.filter(title__istartswith=query)
    else:
        products = videomdl.objects.all()
    data = [{'id': product.id, 'title': product.title, 'thumbnail_url': product.thumbnail.url} for product in products]
    return JsonResponse(data, safe=False)

def live_search(request):
    return render(request, 'videolists.html')

# videolisting page
@login_required
def video_lists(request):
    videos = videomdl.objects.all()
    paginator = Paginator(videos, 2)  
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'videolists.html',  {'page_obj': page_obj})

# createvideo
@login_required
def createvideo(request):
    if request.method == 'POST':
        form = videoform(request.POST, request.FILES)  # Include request.FILES here
        if form.is_valid():
            form.save()
            return redirect('videolists')  
    else:  
        form = videoform()
    return render(request, 'createvideo.html', {'form': form})

# video edit
@login_required
def video_edit(request,pk):
    product = videomdl.objects.get(pk=pk)
    if request.method == 'POST':
        form = videoform(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            return redirect('videolists')
    else:
        form =videoform(instance=product)           
    return render(request, 'editvideo.html', {'product': product,'form': form})


# deletevideo
@login_required
def deletevideo(request,pk):
    product=videomdl.objects.get(pk=pk)  
    if request.method == 'POST':
        product.delete()
        return redirect('videolists')
    
    return render(request,'videolists.html',{'product':product})


# createplan
@login_required
def createplan(request):
    if request.method=='POST':
        form=planform(request.POST)
        if form.is_valid():
            form.save()
            return redirect('planlists')
    else:
        form=planform()
    return render(request,'createplan.html',{'form':form})


# editplan
@login_required
def planedit(request,pk):
    product = planmdl.objects.get(pk=pk)
    if request.method == 'POST':
        form = planform(request.POST,instance=product)
        if form.is_valid():
            form.save()
            return redirect('planlists')
    else:
        form =planform(instance=product)           
    return render(request, 'planedit.html', {'product': product,'form': form})

# deleteplan
@login_required
def deleteplan(request,pk):
    product=planmdl.objects.ger(pk=pk)
    if request.method=='POST':
        product.delete()
        return redirect('planlists')
    return render(request,'planlists.html',{'product':product})
    
# plan listing
@login_required
def planlists(request):
    plans=planmdl.objects.all()
    return render(request,'planlists.html',{'plans':plans})

# userlists
@login_required
def userlists(request):
    query = request.GET.get('query', '')
    if query:
        users = Profile.objects.filter(Q(username__icontains=query) | Q(email__icontains=query)| Q(phonenumber__icontains=query))   
    else:
        users = Profile.objects.all()

    paginator = Paginator(users, 2)  
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'userlists.html', {'page_obj': page_obj, 'query': query})


from datetime import datetime
from django.db.models import Sum
# subscriber lists
@login_required
def subscriberlist(request):
    
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    query = request.GET.get('query', '')
    if query:
        subscribers = Subscription.objects.filter( Q(plan__title__icontains=query)| Q(plan__price__icontains=query)| Q(user__username__icontains=query))   
    else:

        subscribers = Subscription.objects.all()

    if start_date and end_date:
        # Convert date strings to datetime objects
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.strptime(end_date, "%Y-%m-%d")

        # Filter subscriptions within the date range
        subscribers = subscribers.filter(subscribed_at__date__range=[start_date, end_date])


    paginator = Paginator(subscribers, 2)  
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'subscriberlist.html', {
        'page_obj': page_obj,
        'start_date': start_date,
        'end_date': end_date,
         'query': query
    })

def reveniew(request):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        subscribers = Subscription.objects.all()

        if start_date and end_date:
        # Convert date strings to datetime objects
            start_date = datetime.strptime(start_date, "%Y-%m-%d")
            end_date = datetime.strptime(end_date, "%Y-%m-%d")

        # Filter subscriptions within the date range
            subscribers = subscribers.filter(subscribed_at__date__range=[start_date, end_date])

        paginator=Paginator(subscribers,2)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        total_amount = subscribers.aggregate(total=Sum('plan__price'))['total'] or 0
        return render(request,'reveniew.html',{'page_obj': page_obj,'total_amount': total_amount,'start_date': start_date,
        'end_date': end_date,})


# def subscriberlist(request):
#     subscribers = Subscription.objects.all()
#     paginator = Paginator(subscribers, 1)  # Show 5 videos per page.
#     page_number = request.GET.get('page')
#     page_obj = paginator.get_page(page_number)
#     return render(request, 'subscriberlist.html',  {'page_obj': page_obj})

# def block_user(request, user_id):
#     user = get_object_or_404(Profile, id=user_id)
    
#     user.blocked = True  
#     user.save()
    
#     messages.success(request, f"{user.username} has been blocked successfully.")
#     return redirect('userlists')




@login_required
def toggle_block_user(request, user_id):
    user = get_object_or_404(Profile, id=user_id)
    user.blocked = not user.blocked  # Toggle the blocked status
    user.save()
    if user.blocked:
        messages.success(request, f"{user.user.username} has been blocked successfully.")
    else:
        messages.success(request, f"{user.user.username} has been unblocked successfully.")
    return redirect('userlists')




