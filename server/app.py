from flask import Flask, Blueprint
from flask_cors import CORS

app = Flask(__name__)
api = Blueprint('api', __name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@api.route('/')
def welcome():
    return 'Welcome to backend'

@api.route('/sample', methods=['GET'])
def test_message():
    return 'NSR by @Blackholes-XX'

# Register the blueprint with the prefix /api
app.register_blueprint(api, url_prefix='/api')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8070, debug=True)