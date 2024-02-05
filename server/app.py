from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
# Allow all origins or specify a specific origin
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def welcome():
    return 'Welcome to backend'

@app.route('/sample', methods=['GET'])
def test_message():
    return 'Message from backend'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8070, debug=True)
