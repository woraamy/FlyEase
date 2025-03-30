# recommendation_service.py
from flask import Flask, request, jsonify
from recommendation_api import RecommendationAPI
from flask_cors import CORS

app = Flask(__name__)
recommender = RecommendationAPI()
CORS(app)

@app.route('/recommend/new_user', methods=['POST'])
def recommend_new_user():
    data = request.json
    user_preferences = data.get('user_preferences', None)
    season = data.get('season', 'Summer')
    trip_type = data.get('trip_type', 'Regular Vacation')
    origin = data.get('origin', None)
    top_k = data.get('top_k', 10)

    recommendations = recommender.get_recommendations_for_new_user(
        user_preferences=user_preferences,
        season=season,
        trip_type=trip_type,
        origin=origin,
        top_k=top_k
    )

    return jsonify(recommendations.to_dict(orient='records'))

@app.route('/recommend/existing_user', methods=['POST'])
def recommend_existing_user():
    data = request.json
    user_id = data.get('user_id')
    top_k = data.get('top_k', 10)

    recommendations = recommender.get_recommendations_for_existing_user(
        user_id=user_id,
        top_k=top_k
    )

    return jsonify(recommendations.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=False, port=5000)