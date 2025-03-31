from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.

User = get_user_model()

class Election(models.Model):
    title = models.CharField(max_length=150)
    description = models.TextField()
    category = models.CharField(max_length=250)
    start = models.DateTimeField()
    end = models.DateTimeField()

    def __str__(self):
        return self.title
    
class Position(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='positions')
    title = models.CharField(max_length=100)
    position_management = models.CharField(max_length=250)

    def __str__(self):
        return self.position_management
    

class Candidates(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    positions = models.ForeignKey(Position, on_delete=models.CASCADE, related_name='candidates')
    manifost = models.TextField()
    photo = models.ImageField(upload_to='candidates_img/')

    def __str__(self):
        return f"{self.user.username} - {self.positions.title}"
    

class Voter(models.Model):
    voter = models.ForeignKey(User, on_delete=models.CASCADE)
    election = models.ForeignKey(Election, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    candidates = models.ForeignKey(Candidates, on_delete=models.CASCADE, related_name='received_votes')
    timestap = models.DateTimeField(auto_now_add=True)

    # encrytpion and security
    encrypte_election = models.BinaryField(null=True, blank=True)

    class Meta:
        unique = ('voter' , 'election', 'position')

    def __str__(self):
        return f"Vote by {self.voter.username} in {self.election.title} for {self.position.title}"