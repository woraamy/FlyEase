#
# buildx build --platform linux/amd64s and deploys all microservices to a local Kubernetes instance.
#
# Usage:
#
#   ./scripts/prob-kub/deploy.sh
#

set -u
: "$DATABASE_URL"
: "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
: "$STRIPE_SECRET_KEY"
: "$STRIPE_WEBHOOK_SECRET"
: "$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
: "$CLERK_SECRET_KEY"
: "$LANGSMITH_TRACING"
: "$LANGSMITH_API_KEY"
: "$LANGSMITH_PROJECT"
: "$OPENAI_API_KEY"
: "$HUGGINGFACE_API_KEY"
: "$OPENROUTER_API_KEY"
: "$ACCUWEATHER_API_KEY"
: "$TAVILY_API_KEY"
: "$ASTRA_DB_APPLICATION_TOKEN"
: "$CONNECTION_POSTGRES"
: "$COLLECTION_NAME"
: "$CONTAINER_REGISTRY"


#
# build Docker images.
#

# docker buildx build --platform linux/amd64 --push -t $CONTAINER_REGISTRY/aircraft:1 --file ../../backend/aircraft/Dockerfile-prod ../../backend/aircraft
# docker push $CONTAINER_REGISTRY/aircraft:1

# docker buildx build --platform linux/amd64 --push -t $CONTAINER_REGISTRY/booking:1 --file ../../backend/booking/Dockerfile-prod ../../backend/booking
# docker push $CONTAINER_REGISTRY/booking:1

# docker buildx build --platform linux/amd64 --push -t $CONTAINER_REGISTRY/flight:1 --file ../../backend/flight/Dockerfile-prod ../../backend/flight
# docker push $CONTAINER_REGISTRY/flight:1

# docker buildx build --platform linux/amd64 --push -t $CONTAINER_REGISTRY/travel-plan:1 --file ../../backend/travel-plan/Dockerfile-prod ../../backend/travel-plan
# docker push $CONTAINER_REGISTRY/travel-plan:1

# docker buildx build --platform linux/amd64 --push -t $CONTAINER_REGISTRY/chatbot:1 --file ../../backend/chatbot/Dockerfile-prod ../../backend/chatbot
# docker push $CONTAINER_REGISTRY/chatbot:1

# docker buildx build --platform linux/amd64 --push -t $CONTAINER_REGISTRY/recommend:1 --file ../../backend/recommend/Dockerfile-prod ../../backend/recommend
# docker push $CONTAINER_REGISTRY/recommend:1

# docker buildx build --platform linux/amd64 --push -t $CONTAINER_REGISTRY/frontend:1 --file ../../frontend/Dockerfile-prod ../../frontend
# docker push $CONTAINER_REGISTRY/frontend:1

# 
# Deploy containers to Kubernetes.
#
# 
#
#   kubectl config use-context azure kubernetes service


# kubectl apply -f recommend.yaml
envsubst < aircraft.yaml | kubectl apply -f -
envsubst < booking.yaml | kubectl apply -f -
envsubst < flight.yaml | kubectl apply -f -
envsubst < travel-plan.yaml | kubectl apply -f -
envsubst < frontend.yaml | kubectl apply -f -
# envsubst < chatbot.yaml | kubectl apply -f -
