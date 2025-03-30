# List all installed packages
import subprocess
result = subprocess.run(['pip', 'list'], capture_output=True, text=True)
print(result.stdout)

# If you want to see packages in a specific virtual environment
# or if you want to export requirements to a file:
print("\nTo export requirements to a file, you can run:")
print("pip freeze > requirements.txt")