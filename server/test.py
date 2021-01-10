import json
from json import JSONEncoder
import random

from game import Game


random.seed(0)


class MyEncoder(JSONEncoder):
    def default(_self, o):
        return o.data()


game = Game(["David", "Kris"])

for player in game.players:
    print(player)
    for card in player.hand:
        print(card)

    print()

while not game.is_over():
    turn = game.turn
    player = game.players[turn % 2]

    print(f"current player: {player}")
    print(player.hand)

    index = int(input("Pick a card to play: "))
    # type = int(input("Pick a type (0: point) (1: special): "))
    # types = ["point", "special"]
    game.move(player, {
        "action": 'play',
        "index": index,
        "type": "point"
    })

print(f"winner: {game.field.get_winner()}")

# print(json.dumps(game, cls=MyEncoder, indent=2))
