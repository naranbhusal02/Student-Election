from django.shortcuts import render, redirect
from .forms import RegistrationForm
from django.contrib.auth import logout
from django.contrib import messages

# Create your views here.


def register_view(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            form.save()
            messages.success(request, 'Account created successfully, Now you can login')
            return redirect('login')
        else:
            messages.error(request, 'Please correct the errors below.')
            print(form.errors)
    else:
        form = RegistrationForm()
    return render(request, 'registration/register.html', {'form' : form})
    

def logout_view(request):
    logout(request)
    return redirect('login')