from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, Team, Activity, Leaderboard, Workout

# Model Tests
class UserModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team', description='Test Description')
    
    def test_create_user(self):
        user = User.objects.create(email='test@example.com', name='Test User', team=self.team)
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.name, 'Test User')
        self.assertEqual(user.team.name, 'Test Team')
    
    def test_user_string_representation(self):
        user = User.objects.create(email='test@example.com', name='Test User', team=self.team)
        self.assertEqual(str(user), 'Test User')
    
    def test_user_without_team(self):
        user = User.objects.create(email='solo@example.com', name='Solo User')
        self.assertIsNone(user.team)

class TeamModelTest(TestCase):
    def test_create_team(self):
        team = Team.objects.create(name='Test Team', description='Test Description')
        self.assertEqual(team.name, 'Test Team')
        self.assertEqual(team.description, 'Test Description')
    
    def test_team_string_representation(self):
        team = Team.objects.create(name='Avengers')
        self.assertEqual(str(team), 'Avengers')
    
    def test_team_unique_name(self):
        Team.objects.create(name='Unique Team')
        with self.assertRaises(Exception):
            Team.objects.create(name='Unique Team')

class ActivityModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create(email='test@example.com', name='Test User', team=self.team)
    
    def test_create_activity(self):
        activity = Activity.objects.create(user=self.user, type='Running', duration=30)
        self.assertEqual(activity.type, 'Running')
        self.assertEqual(activity.duration, 30)
        self.assertEqual(activity.user, self.user)
        self.assertIsNotNone(activity.timestamp)
    
    def test_activity_string_representation(self):
        activity = Activity.objects.create(user=self.user, type='Cycling', duration=45)
        self.assertEqual(str(activity), 'Cycling - Test User')

class WorkoutModelTest(TestCase):
    def setUp(self):
        self.team1 = Team.objects.create(name='Team 1')
        self.team2 = Team.objects.create(name='Team 2')
    
    def test_create_workout(self):
        workout = Workout.objects.create(name='Test Workout', description='Test Description')
        workout.suggested_for.set([self.team1, self.team2])
        self.assertEqual(workout.name, 'Test Workout')
        self.assertEqual(workout.suggested_for.count(), 2)
        self.assertIn(self.team1, workout.suggested_for.all())
        self.assertIn(self.team2, workout.suggested_for.all())
    
    def test_workout_string_representation(self):
        workout = Workout.objects.create(name='HIIT Training')
        self.assertEqual(str(workout), 'HIIT Training')

class LeaderboardModelTest(TestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
    
    def test_create_leaderboard(self):
        leaderboard = Leaderboard.objects.create(team=self.team, points=100)
        self.assertEqual(leaderboard.team.name, 'Test Team')
        self.assertEqual(leaderboard.points, 100)
    
    def test_leaderboard_string_representation(self):
        leaderboard = Leaderboard.objects.create(team=self.team, points=250)
        self.assertEqual(str(leaderboard), 'Test Team: 250')
    
    def test_leaderboard_default_points(self):
        leaderboard = Leaderboard.objects.create(team=self.team)
        self.assertEqual(leaderboard.points, 0)

# API Tests
class UserAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='API Team')
        self.user = User.objects.create(email='api@example.com', name='API User', team=self.team)
    
    def test_get_users_list(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    
    def test_get_user_detail(self):
        response = self.client.get(f'/api/users/{self.user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'API User')

class TeamAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='API Team', description='Test Team')
    
    def test_get_teams_list(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    
    def test_get_team_detail(self):
        response = self.client.get(f'/api/teams/{self.team.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'API Team')

class ActivityAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.user = User.objects.create(email='test@example.com', name='Test User', team=self.team)
        self.activity = Activity.objects.create(user=self.user, type='Running', duration=30)
    
    def test_get_activities_list(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

class LeaderboardAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.leaderboard = Leaderboard.objects.create(team=self.team, points=150)
    
    def test_get_leaderboard_list(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

class WorkoutAPITest(APITestCase):
    def setUp(self):
        self.team = Team.objects.create(name='Test Team')
        self.workout = Workout.objects.create(name='Test Workout', description='Description')
        self.workout.suggested_for.set([self.team])
    
    def test_get_workouts_list(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
