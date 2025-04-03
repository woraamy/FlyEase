import pickle
import pandas as pd
import os
import sys
from model import FlightRecommendationModel  # Import the class definition

class RecommendationAPI:
    def __init__(self, model_path="recommendation_customer_booking.pkl"):
        """Initialize the recommendation API with a pre-trained model"""
        self.model = None
        self.model_path = model_path
        self._load_model()

    def _load_model(self):
        """Load the pre-trained model from disk"""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model file {self.model_path} not found.")

        try:
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            print(f"Model loaded from {self.model_path}")
        except Exception as e:
            raise Exception(f"Error loading model: {e}")

    def get_recommendations_for_new_user(self, user_preferences=None, season='Summer', trip_type='Regular Vacation', origin=None, top_k=10):
        """Get recommendations for a new user"""
        if self.model is None:
            raise Exception("Model not loaded. Call _load_model() first.")

        try:
            recommendations = self.model.get_recommendations_for_new_user(
                user_preferences=user_preferences,
                season=season,
                trip_type=trip_type,
                origin=origin,
                top_k=top_k
            )
            return recommendations
        except Exception as e:
            print(f"Error getting recommendations for new user: {e}")
            return None

    def get_recommendations_for_existing_user(self, user_id, top_k=10):
        """Get recommendations for an existing user"""
        if self.model is None:
            raise Exception("Model not loaded. Call _load_model() first.")

        try:
            recommendations = self.model.get_recommendations_for_user(
                user_id=user_id,
                top_k=top_k
            )
            return recommendations
        except Exception as e:
            print(f"Error getting recommendations for existing user: {e}")
            return None