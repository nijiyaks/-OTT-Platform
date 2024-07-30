from django import forms
from .models import videomdl,planmdl

class videoform(forms.ModelForm):
     class Meta:
        model = videomdl
        fields = ['title', 'thumbnail', 'video_file', 'description']

 
class planform(forms.ModelForm):
     class Meta:
        model = planmdl
        fields = ['title', 'duration', 'description', 'price']





