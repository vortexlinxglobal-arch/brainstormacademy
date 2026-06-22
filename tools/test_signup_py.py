import json
import urllib.request

url = 'http://localhost:3000/api/v1/auth/signup'
data = {
    'email': 'test+local@example.com',
    'password': 'Password123',
    'full_name': 'Local Test',
    'date_of_birth': '2000-01-01',
    'trade_code': 'WEB',
}
req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req, timeout=10) as response:
        body = response.read().decode('utf-8')
        print('STATUS', response.status)
        print(body)
except urllib.error.HTTPError as e:
    body = e.read().decode('utf-8')
    print('STATUS', e.code)
    print(body)
except Exception as e:
    print('ERROR', str(e))
