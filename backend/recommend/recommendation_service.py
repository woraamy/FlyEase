# recommendation_service.py
from flask import Flask, request, jsonify
from recommendation_api import RecommendationAPI
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/": {"origins": ""}})
recommender = RecommendationAPI()

@app.route('/recommend/new_user', methods=['POST'])
def recommend_new_user():
    print("Received request:", request.json)
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON data received"}), 400

        user_preferences = data.get('user_preferences', {})
        season = data.get('season', 'Summer')
        trip_type = data.get('trip_type', 'Regular Vacation')
        origin = data.get('origin', None)
        top_k = data.get('top_k', 10)

        # print(f"Processing with: user_preferences={user_preferences}, season={season}, trip_type={trip_type}")

        recommendations = recommender.get_recommendations_for_new_user(
            user_preferences=user_preferences,
            season=season,
            trip_type=trip_type,
            origin=origin,
            top_k=top_k
        )

        return jsonify(recommendations.to_dict(orient='records'))
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, port=5001)