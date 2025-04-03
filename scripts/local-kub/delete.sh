# 
# Remove containers from Kubernetes.
#
# Usage:
#
#   ./scripts/production-kub/delete.sh
#


kubectl delete -f ingress.yaml
kubectl delete -f chatbot.yaml
kubectl delete -f recommend.yaml

envsubst < aircraft.yaml | kubectl delete -f -
envsubst < booking.yaml | kubectl delete -f -
envsubst < flight.yaml | kubectl delete -f -
envsubst < travel-plan.yaml | kubectl delete -f -
envsubst < frontend.yaml | kubectl delete -f -
