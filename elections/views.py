from django.shortcuts import render

# Create your views here.


def dashborad(request):
    return render(request, 'pages/dashboard.html')