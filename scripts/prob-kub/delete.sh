# 
# Remove containers from Kubernetes.
#
# Usage:
#
#   ./scripts/production-kub/delete.sh
#


kubectl delete -f chatbot.yaml
kubectl delete -f recommend.yaml
kubectl delete -f ingress.yaml
kubectl delete -f aircraft.yaml 
kubectl delete -f booking.yaml
kubectl delete -f travel-plan.yaml
kubectl delete -f frontend.yaml
