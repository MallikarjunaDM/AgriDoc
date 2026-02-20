import requests

url = "http://localhost:8000/api/doctor/diagnose"
payload = {
    "message": "My tomato plant has yellow leaves",
    "chat_history": [],
    "language": "hi",
    "language_name": "Hindi"
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Response:\n{data.get('diagnosis', data)}")
except Exception as e:
    print(f"Error: {e}")
