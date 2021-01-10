from flask import Flask
from flask_socketio import SocketIO

app = Flask(__name__)
app.config['SECRET_KEY'] = 'aohoamoimoimoiae'
socketio = SocketIO(app)
