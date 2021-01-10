import json
from os import getenv

from flask.json import JSONEncoder

import flask
from flask import Flask, session, send_from_directory
from flask_socketio import SocketIO
from flask_session import Session
from flask_cors import CORS


from server.game import Game


class MyEncoder(JSONEncoder):
    def default(_, o):
        return o.data()


app = Flask(__name__, static_folder='./build/static',
            template_folder='./build')
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SECRET_KEY'] = 'afaefa42oimogi490sm0'
app.config['SESSION_TYPE'] = 'filesystem'

Session(app)

app.json_encoder = MyEncoder
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    json=flask.json,
    manage_session=False
)


game = Game()
for name in ['David', 'Kris']:
    game.add_player(name)


@app.route("/", defaults={"filename": "index.html"})
@app.route("/<path:filename>")
def get_client(filename):
    return send_from_directory("./build", filename)


@app.errorhandler(404)
def page_not_found(_):
    return send_from_directory("./build", "index.html")


@app.route('/login/<username>')
def login(username):
    session['username'] = username
    return "ok"


def get_player():
    global game
    username = session.get('username', '')
    return game.get_player(username)


def get_state():
    global game
    return game.get_state()


def get_hands():
    global game
    player = get_player()
    return game.get_hands(player)


def get_players():
    global game
    player = get_player()
    return game.get_players(player)


def get_oneoff():
    global game
    return game.oneoff


def move(player, data):
    global game
    return game.move(player, data)


def restart():
    global game
    game.restart()
    socketio.emit('restart', broadcast=True)


def oneoff():
    socketio.emit('oneoff', get_oneoff())


def emit_all():
    socketio.emit('update', get_state(), broadcast=True)


@socketio.on('connect')
def handle_message():
    pass
    # socketio.emit('update', get_state())
    # socketio.emit('players', get_players(), broadcast=False)
    # socketio.emit('oneoff', get_oneoff(), broadcast=False)


@socketio.on('get_data')
def on_get_data():
    return get_state()


@socketio.on('restart')
def on_restart():
    restart()
    # emit_all()


@socketio.on('get_hands')
def on_get_hand():
    return get_hands()


@socketio.on('get_players')
def on_get_players():
    return get_players()


@socketio.on('test')
def test():
    return session.get('username', 'no username')


@socketio.on('get_oneoff')
def on_get_oneoff():
    return get_oneoff()


@socketio.on('move')
def on_move(data):
    player = get_player()
    print(json.dumps(data, indent=2))
    success, response = move(player, data)
    if success:
        if response is not None:
            emit_all()
            socketio.emit('oneoff', response)
        else:
            emit_all()


if __name__ == '__main__':
    socketio.run(
        app,
        debug=False,
        host=getenv("IP", "0.0.0.0"),
        port=int(getenv("PORT", "80")),
        use_reloader=True
    )
