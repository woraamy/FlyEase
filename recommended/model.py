import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

import pandas as pd
import numpy as np
import os
import sys
import time
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics.pairwise import cosine_similarity
import matplotlib.pyplot as plt
import seaborn as sns

# Set up a timer class for measuring performance
class Timer:
    def __enter__(self):
        self.start = time.time()
        return self

    def __exit__(self, *args):
        self.interval = time.time() - self.start

print(f"System version: {sys.version}")

# Set the default parameters
TOP_K = 10  # top k destinations to recommend

# Column names for the recommendation system
COL_USER = "user_id"
COL_ITEM = "destination"
COL_RATING = "rating"
COL_TIMESTAMP = "timestamp"

# Load the customer_booking.csv file
try:
    data = pd.read_csv("customer_booking.csv", encoding='latin1')
    print("Original data sample:")
    print(data.head())
except Exception as e:
    print(f"Error loading data: {e}")
    sys.exit(1)

# Data preparation
# 1. Extract origin and destination from route
data['origin'] = data['route'].str[:3]
data['destination'] = data['route'].str[3:]

print("\nData with origin and destination extracted:")
print(data[['route', 'origin', 'destination']].head())

# 2. Create a synthetic user_id based on booking patterns
data['user_id'] = (
    data['booking_origin'].astype(str) + '_' +
    data['trip_type'].astype(str) + '_' +
    data['flight_day'].astype(str)
).apply(hash) % 10000  # Modulo to keep IDs manageable

# 3. Calculate implicit ratings based on user behavior
data['rating'] = (
    # Base rating from booking completion
    np.where(data['booking_complete'] == 1, 5.0, 0.0) +
    # Add value for premium services
    np.where(data['wants_extra_baggage'] == 1, 1.0, 0.0) +
    np.where(data['wants_preferred_seat'] == 1, 1.0, 0.0) +
    np.where(data['wants_in_flight_meals'] == 1, 1.0, 0.0) +
    # Base rating from number of passengers (normalized)
    data['num_passengers'] / 2
)

# 4. Add contextual features
# Season based on purchase_lead (assuming current date)
data['season'] = pd.cut(
    data['purchase_lead'] % 365,
    bins=[0, 90, 180, 270, 365],
    labels=['Winter', 'Spring', 'Summer', 'Fall']
)

# Trip purpose inference
data['trip_purpose'] = pd.cut(
    data['length_of_stay'],
    bins=[-1, 3, 14, float('inf')],
    labels=['Business', 'Regular Vacation', 'Extended Vacation']
)

# Use purchase_lead as timestamp (for recency)
data['timestamp'] = data['purchase_lead']

print("\nProcessed data with user profiles and ratings:")
print(data[['user_id', 'destination', 'rating', 'season', 'trip_purpose']].head())

# Calculate destination popularity metrics
destination_popularity = data.groupby('destination').agg(
    booking_count=('user_id', 'count'),
    avg_rating=('rating', 'mean'),
    completed_bookings=('booking_complete', 'sum'),
    unique_users=('user_id', 'nunique')
).reset_index()

destination_popularity['popularity_score'] = (
    destination_popularity['booking_count'] * 0.3 +
    destination_popularity['avg_rating'] * 0.4 +
    destination_popularity['completed_bookings'] * 0.2 +
    destination_popularity['unique_users'] * 0.1
)

destination_popularity = destination_popularity.sort_values('popularity_score', ascending=False)

print("\nDestination popularity metrics:")
print(destination_popularity.head(10))

# Join popularity metrics back to the main dataset
data = data.merge(
    destination_popularity[['destination', 'popularity_score']],
    on='destination',
    how='left'
)

# Adjust ratings based on popularity (optional - can be weighted)
data['adjusted_rating'] = data['rating'] * 0.8 + data['popularity_score'] * 0.2

print("\nData with popularity-adjusted ratings:")
print(data[['user_id', 'destination', 'rating', 'popularity_score', 'adjusted_rating']].head())

# Create a user-item matrix for collaborative filtering
# First, remove duplicates to handle potential errors
user_item_df = data[['user_id', 'destination', 'adjusted_rating']].drop_duplicates()

# Create a pivot table: users as rows, destinations as columns, ratings as values
user_item_matrix = user_item_df.pivot_table(
    index='user_id',
    columns='destination',
    values='adjusted_rating',
    fill_value=0
)

print("\nUser-Item Matrix (sample):")
print(user_item_matrix.head())

# Split the data into training and test sets
train_data, test_data = train_test_split(data, test_size=0.25, random_state=42)
print(f"\nTraining set size: {len(train_data)}")
print(f"Test set size: {len(test_data)}")

# Create a destination mapping dictionary
destination_mapping = {
    'id': {i: dest for i, dest in enumerate(destination_popularity['destination'])},
    'destination': {dest: i for i, dest in enumerate(destination_popularity['destination'])}
}

print("\nDestination mapping sample:")
print({k: destination_mapping['id'][k] for k in list(destination_mapping['id'])[:5]})

# Create a class for the recommendation model
class FlightRecommendationModel:
    def __init__(self, user_item_matrix, destination_popularity, destination_mapping):
        self.user_item_matrix = user_item_matrix
        self.destination_popularity = destination_popularity
        self.destination_mapping = destination_mapping
        self.user_similarity = None

        # Calculate user similarity matrix
        with Timer() as similarity_time:
            self.calculate_user_similarity()
        print(f"User similarity calculation completed in {similarity_time.interval:.2f} seconds")

    def calculate_user_similarity(self):
        """Calculate similarity between users"""
        # Calculate cosine similarity between users
        user_similarity = cosine_similarity(self.user_item_matrix)
        self.user_similarity = pd.DataFrame(
            user_similarity,
            index=self.user_item_matrix.index,
            columns=self.user_item_matrix.index
        )

    def collaborative_filtering_recommendations(self, user_id, n_recommendations=10):
        """Generate recommendations for a user using collaborative filtering"""
        # If user is not in the matrix, return popular destinations
        if user_id not in self.user_similarity.index:
            return self.popularity_based_recommendations(n_recommendations)

        # Get similar users
        similar_users = self.user_similarity[user_id].sort_values(ascending=False)[1:11]  # Top 10 similar users

        # Get destinations that similar users liked but the target user hasn't rated
        user_destinations = set(self.user_item_matrix.columns[self.user_item_matrix.loc[user_id] > 0])

        recommendations = {}
        for similar_user, similarity in similar_users.items():
            # Skip if similarity is too low
            if similarity <= 0:
                continue

            # Get destinations that similar user liked
            similar_user_destinations = set(self.user_item_matrix.columns[self.user_item_matrix.loc[similar_user] > 3])

            # Find destinations that similar user liked but target user hasn't rated
            new_destinations = similar_user_destinations - user_destinations

            for destination in new_destinations:
                if destination in recommendations:
                    recommendations[destination] += similarity * self.user_item_matrix.loc[similar_user, destination]
                else:
                    recommendations[destination] = similarity * self.user_item_matrix.loc[similar_user, destination]

        # If no recommendations found, use popularity-based
        if not recommendations:
            return self.popularity_based_recommendations(n_recommendations)

        # Sort recommendations by score
        recommendations = sorted(recommendations.items(), key=lambda x: x[1], reverse=True)

        # Return top n recommendations
        return [dest for dest, score in recommendations[:n_recommendations]]

    def popularity_based_recommendations(self, n_recommendations=10):
        """Generate recommendations based on destination popularity"""
        return self.destination_popularity.head(n_recommendations)['destination'].tolist()

    def seasonal_recommendations(self, season, n_recommendations=10):
        """Generate recommendations based on season"""
        seasonal_data = data[data['season'] == season]

        seasonal_popularity = seasonal_data.groupby('destination').agg(
            booking_count=('user_id', 'count'),
            avg_rating=('rating', 'mean')
        ).reset_index()

        seasonal_popularity['seasonal_score'] = (
            seasonal_popularity['booking_count'] * 0.6 +
            seasonal_popularity['avg_rating'] * 0.4
        )

        seasonal_popularity = seasonal_popularity.sort_values('seasonal_score', ascending=False)

        return seasonal_popularity.head(n_recommendations)['destination'].tolist()

    def trip_type_recommendations(self, trip_type, n_recommendations=10):
        """Generate recommendations based on trip type"""
        trip_data = data[data['trip_purpose'] == trip_type]

        trip_popularity = trip_data.groupby('destination').agg(
            booking_count=('user_id', 'count'),
            avg_rating=('rating', 'mean')
        ).reset_index()

        trip_popularity['trip_score'] = (
            trip_popularity['booking_count'] * 0.6 +
            trip_popularity['avg_rating'] * 0.4
        )

        trip_popularity = trip_popularity.sort_values('trip_score', ascending=False)

        return trip_popularity.head(n_recommendations)['destination'].tolist()

    def hybrid_recommendations(self, user_id, season, trip_type, n_recommendations=10):
        """Generate hybrid recommendations combining collaborative filtering, popularity, and contextual factors"""
        # Get recommendations from each model
        cf_recs = self.collaborative_filtering_recommendations(user_id, n_recommendations*2)
        pop_recs = self.popularity_based_recommendations(n_recommendations*2)
        season_recs = self.seasonal_recommendations(season, n_recommendations*2)
        trip_recs = self.trip_type_recommendations(trip_type, n_recommendations*2)

        # Combine recommendations with weights
        all_recs = {}

        # Collaborative filtering recommendations (highest weight)
        for i, dest in enumerate(cf_recs):
            all_recs[dest] = all_recs.get(dest, 0) + (n_recommendations*2 - i) * 0.4

        # Popularity recommendations
        for i, dest in enumerate(pop_recs):
            all_recs[dest] = all_recs.get(dest, 0) + (n_recommendations*2 - i) * 0.2

        # Seasonal recommendations
        for i, dest in enumerate(season_recs):
            all_recs[dest] = all_recs.get(dest, 0) + (n_recommendations*2 - i) * 0.2

        # Trip type recommendations
        for i, dest in enumerate(trip_recs):
            all_recs[dest] = all_recs.get(dest, 0) + (n_recommendations*2 - i) * 0.2

        # Sort by score and return top n
        sorted_recs = sorted(all_recs.items(), key=lambda x: x[1], reverse=True)

        return [dest for dest, score in sorted_recs[:n_recommendations]]

    def get_recommendations_for_user(self, user_id, season=None, trip_type=None, top_k=10):
        """Get personalized destination recommendations for a specific user"""
        # Get user's contextual information if not provided
        if user_id in data['user_id'].values and (season is None or trip_type is None):
            user_data = data[data['user_id'] == user_id]
            season = user_data['season'].mode()[0] if season is None else season
            trip_type = user_data['trip_purpose'].mode()[0] if trip_type is None else trip_type
        else:
            # Default values if user not found or values not provided
            season = 'Summer' if season is None else season
            trip_type = 'Regular Vacation' if trip_type is None else trip_type

        # Get hybrid recommendations
        recs = self.hybrid_recommendations(user_id, season, trip_type, top_k)

        # Get additional information about recommendations
        rec_info = []
        for dest in recs:
            dest_data = destination_popularity[destination_popularity['destination'] == dest]
            if not dest_data.empty:
                rec_info.append({
                    'destination': dest,
                    'popularity_score': dest_data['popularity_score'].values[0],
                    'booking_count': dest_data['booking_count'].values[0],
                    'avg_rating': dest_data['avg_rating'].values[0]
                })

        rec_df = pd.DataFrame(rec_info)

        return rec_df

    def get_recommendations_for_new_user(self, user_preferences=None, season='Summer', trip_type='Regular Vacation', origin=None, top_k=10):
        """Generate recommendations for a new user based on preferences and contextual factors"""
        # Default preferences if none provided
        if user_preferences is None:
            user_preferences = {
                "wants_extra_baggage": 0,
                "wants_preferred_seat": 0,
                "wants_in_flight_meals": 0,
                "num_passengers": 1,
                "length_of_stay": 7
            }

        # 1. Get popular destinations for the current season
        season_recs = self.seasonal_recommendations(season, top_k*2)

        # 2. Get popular destinations for the trip type
        trip_recs = self.trip_type_recommendations(trip_type, top_k*2)

        # 3. If origin is provided, get popular routes from that origin
        if origin:
            origin_data = data[data['origin'] == origin]
            origin_popularity = origin_data.groupby('destination').agg(
                booking_count=('user_id', 'count'),
                avg_rating=('rating', 'mean')
            ).reset_index()

            origin_popularity['origin_score'] = (
                origin_popularity['booking_count'] * 0.6 +
                origin_popularity['avg_rating'] * 0.4
            )

            origin_popularity = origin_popularity.sort_values('origin_score', ascending=False)
            origin_recs = origin_popularity.head(top_k*2)['destination'].tolist()
        else:
            origin_recs = []

        # 4. Get destinations popular with users with similar preferences
        # Calculate a preference similarity score
        preference_filter = (
            (data['wants_extra_baggage'] == user_preferences.get('wants_extra_baggage', 0)) &
            (data['wants_preferred_seat'] == user_preferences.get('wants_preferred_seat', 0)) &
            (data['wants_in_flight_meals'] == user_preferences.get('wants_in_flight_meals', 0))
        )

        # Add passenger count similarity if provided
        if 'num_passengers' in user_preferences:
            preference_filter = preference_filter & (
                (data['num_passengers'] >= user_preferences['num_passengers'] - 1) &
                (data['num_passengers'] <= user_preferences['num_passengers'] + 1)
            )

        # Add length of stay similarity if provided
        if 'length_of_stay' in user_preferences:
            preference_filter = preference_filter & (
                (data['length_of_stay'] >= user_preferences['length_of_stay'] - 3) &
                (data['length_of_stay'] <= user_preferences['length_of_stay'] + 3)
            )

        preference_data = data[preference_filter]
        preference_popularity = preference_data.groupby('destination').agg(
            booking_count=('user_id', 'count'),
            avg_rating=('rating', 'mean')
        ).reset_index()

        preference_popularity['preference_score'] = (
            preference_popularity['booking_count'] * 0.6 +
            preference_popularity['avg_rating'] * 0.4
        )

        preference_popularity = preference_popularity.sort_values('preference_score', ascending=False)
        preference_recs = preference_popularity.head(top_k*2)['destination'].tolist()

        # 5. Combine all recommendation sources
        all_recs = {}

        # Global popularity recommendations
        pop_recs = self.popularity_based_recommendations(top_k*2)
        for i, dest in enumerate(pop_recs):
            all_recs[dest] = all_recs.get(dest, 0) + (top_k*2 - i) * 0.2

        # Seasonal recommendations
        for i, dest in enumerate(season_recs):
            all_recs[dest] = all_recs.get(dest, 0) + (top_k*2 - i) * 0.2

        # Trip type recommendations
        for i, dest in enumerate(trip_recs):
            all_recs[dest] = all_recs.get(dest, 0) + (top_k*2 - i) * 0.2

        # Origin-based recommendations
        if origin_recs:
            for i, dest in enumerate(origin_recs):
                all_recs[dest] = all_recs.get(dest, 0) + (top_k*2 - i) * 0.2

        # Preference-based recommendations
        for i, dest in enumerate(preference_recs):
            all_recs[dest] = all_recs.get(dest, 0) + (top_k*2 - i) * 0.2

        # Sort by score and return top n
        sorted_recs = sorted(all_recs.items(), key=lambda x: x[1], reverse=True)

        # Get additional information about recommendations
        rec_info = []
        for dest, score in sorted_recs[:top_k]:
            dest_data = destination_popularity[destination_popularity['destination'] == dest]
            if not dest_data.empty:
                rec_info.append({
                    'destination': dest,
                    'score': score,
                    'popularity_score': dest_data['popularity_score'].values[0],
                    'booking_count': dest_data['booking_count'].values[0],
                    'avg_rating': dest_data['avg_rating'].values[0]
                })

        rec_df = pd.DataFrame(rec_info)

        return rec_df

# Train the model
with Timer() as train_time:
    model = FlightRecommendationModel(user_item_matrix, destination_popularity, destination_mapping)

print(f"\nTraining completed in {train_time.interval:.2f} seconds")

# Save the model
model_path = "recommendation_customer_booking.pkl"
with open(model_path, 'wb') as f:
    pickle.dump(model, f)
print(f"Model saved to {model_path}")

# Save the destination mapping for later use
mapping_path = "destination_mapping.pkl"
with open(mapping_path, 'wb') as f:
    pickle.dump(destination_mapping, f)
print(f"Destination mapping saved to {mapping_path}")

# Save the destination popularity for later use
popularity_path = "destination_popularity.pkl"
with open(popularity_path, 'wb') as f:
    pickle.dump(destination_popularity, f)
print(f"Destination popularity saved to {popularity_path}")

# Visualize destination popularity
# plt.figure(figsize=(10, 6))
# top_destinations = destination_popularity.head(10)
# sns.barplot(x='destination', y='popularity_score', data=top_destinations)
# plt.title('Top 10 Most Popular Destinations')
# plt.xlabel('Destination')
# plt.ylabel('Popularity Score')
# plt.xticks(rotation=45)
# plt.tight_layout()
# plt.savefig('destination_popularity.png')
# print("\nDestination popularity chart saved as 'destination_popularity.png'")

print("\nModel building and saving complete!")
print(f"Files created during execution:")
print(f"1. {model_path} - The recommendation model")
print(f"2. {mapping_path} - Mapping between destination codes and IDs")
print(f"3. {popularity_path} - Destination popularity metrics")
print(f"4. destination_popularity.png - Visualization of top destinations")