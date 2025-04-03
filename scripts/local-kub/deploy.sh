#
# Builds and deploys all microservices to a local Kubernetes instance.
#
# Usage:
#
#   ./scripts/local-kub/deploy.sh
#

set -u
: "$DATABASE_URL"
: "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
: "$STRIPE_SECRET_KEY"
: "$STRIPE_WEBHOOK_SECRET"
: "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
: "$CLERK_SECRET_KEY"

#
# Build Docker images.
#

docker build -t aircraft:1 --file ../../backend/aircraft/Dockerfile-prod ../../backend/aircraft
docker build -t booking:1 --file ../../backend/booking/Dockerfile-prod ../../backend/booking
docker build -t flight:1 --file ../../backend/flight/Dockerfile-prod ../../backend/flight
docker build -t travel-plan:1 --file ../../backend/travel-plan/Dockerfile-prod ../../backend/travel-plan
docker build -t chatbot:1 --file ../../backend/chatbot/Dockerfile-prod ../../backend/chatbot
docker build -t recommend:1 --file ../../backend/recommend/Dockerfile-prod ../../backend/recommend
docker build -t frontend:1 --file ../../frontend/Dockerfile-prod ../../frontend

# 
# Deploy containers to Kubernetes.
#
# Don't forget to change kubectl to your local Kubernetes instance, like this:
#
#   kubectl config use-context docker-desktop


kubectl apply -f ingress.yaml
# kubectl apply -f chatbot.yaml
# kubectl apply -f recommend.yaml#

envsubst < aircraft.yaml | kubectl apply -f -
envsubst < booking.yaml | kubectl apply -f -
envsubst < flight.yaml | kubectl apply -f -
# envsubst < travel-plan.yaml | kubectl apply -f -
envsubst < frontend.yaml | kubectl apply -f -
