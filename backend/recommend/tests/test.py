import unittest
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics.pairwise import cosine_similarity
import pickle
import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from model import FlightRecommendationModel

class TestFlightRecommendationModel(unittest.TestCase):

    def setUp(self):
        # Create a sample dataset
        data = pd.DataFrame({
            'user_id': [1, 1, 1, 2, 2, 3, 3, 3],
            'destination': ['A', 'B', 'C', 'A', 'B', 'A', 'C', 'D'],
            'rating': [5, 4, 3, 5, 4, 3, 2, 1],
            'season': ['Summer', 'Summer', 'Summer', 'Summer', 'Summer', 'Summer', 'Summer', 'Summer'],
            'trip_purpose': ['Regular Vacation', 'Regular Vacation', 'Regular Vacation', 'Regular Vacation', 'Regular Vacation', 'Regular Vacation', 'Regular Vacation', 'Regular Vacation']
        })

        # Calculate destination popularity metrics
        destination_popularity = data.groupby('destination').agg(
            booking_count=('user_id', 'count'),
            avg_rating=('rating', 'mean'),
            completed_bookings=('rating', 'sum'),
            unique_users=('user_id', 'nunique')
        ).reset_index()

        destination_popularity['popularity_score'] = (
            destination_popularity['booking_count'] * 0.3 +
            destination_popularity['avg_rating'] * 0.4 +
            destination_popularity['completed_bookings'] * 0.2 +
            destination_popularity['unique_users'] * 0.1
        )

        destination_popularity = destination_popularity.sort_values('popularity_score', ascending=False)

        # Create a user-item matrix
        user_item_df = data[['user_id', 'destination', 'rating']].drop_duplicates()
        user_item_matrix = user_item_df.pivot_table(
            index='user_id',
            columns='destination',
            values='rating',
            fill_value=0
        )

        # Create a destination mapping dictionary
        destination_mapping = {
            'id': {i: dest for i, dest in enumerate(destination_popularity['destination'])},
            'destination': {dest: i for i, dest in enumerate(destination_popularity['destination'])}
        }

        self.model = FlightRecommendationModel(user_item_matrix, destination_popularity, destination_mapping)

    def test_calculate_user_similarity(self):
        self.model.calculate_user_similarity()
        self.assertIsNotNone(self.model.user_similarity)

    def test_collaborative_filtering_recommendations(self):
        recommendations = self.model.collaborative_filtering_recommendations(1)
        self.assertIsInstance(recommendations, list)
        self.assertGreater(len(recommendations), 0)

    def test_popularity_based_recommendations(self):
        recommendations = self.model.popularity_based_recommendations()
        self.assertIsInstance(recommendations, list)
        self.assertGreater(len(recommendations), 0)

    def test_seasonal_recommendations(self):
        recommendations = self.model.seasonal_recommendations('Summer')
        self.assertIsInstance(recommendations, list)
        self.assertGreater(len(recommendations), 0)

    def test_trip_type_recommendations(self):
        recommendations = self.model.trip_type_recommendations('Regular Vacation')
        self.assertIsInstance(recommendations, list)
        self.assertGreater(len(recommendations), 0)

    def test_hybrid_recommendations(self):
        recommendations = self.model.hybrid_recommendations(1, 'Summer', 'Regular Vacation')
        self.assertIsInstance(recommendations, list)
        self.assertGreater(len(recommendations), 0)

    def test_get_recommendations_for_user(self):
        recommendations = self.model.get_recommendations_for_user(1)
        self.assertIsInstance(recommendations, pd.DataFrame)
        self.assertGreater(len(recommendations), 0)

    def test_get_recommendations_for_new_user(self):
        recommendations = self.model.get_recommendations_for_new_user()
        self.assertIsInstance(recommendations, pd.DataFrame)
        self.assertGreater(len(recommendations), 0)

    def test_save_and_load_model(self):
        model_path = "test_recommendation_customer_booking.pkl"
        with open(model_path, 'wb') as f:
            pickle.dump(self.model, f)

        with open(model_path, 'rb') as f:
            loaded_model = pickle.load(f)

        self.assertIsInstance(loaded_model, FlightRecommendationModel)

if __name__ == '__main__':
    unittest.main()
