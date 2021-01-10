from server.card import Deck, Card
from server.field import Field
from server.player import Player


class Game:
    def __init__(self):
        self.players = []

    def add_player(self, name):
        self.players.append(Player(name))

        if len(self.players) == 2:
            self.start()

    def start(self):
        self.deck = Deck()
        for i in range(52):
            suit, value = divmod(i, 13)
            self.deck.add(Card(suit, value))

        self.deck.shuffle()

        for _ in range(4):
            for player in self.players:
                player.draw(self.deck)

        self.players[1].draw(self.deck)  # Second player gets extra card

        self.discard = Deck()

        self.field = Field(self.players, self.discard, self.deck, self)

        self.effects = []
        self.oneoff = None

        self.turn = 0

    def restart(self):
        self.players = [Player(player.name) for player in self.players[::-1]]

        self.start()

    def play(self, player, index, type="point", targets=[]):
        if type == "point":
            card = player.play(index)
            self.field.play_point(player, card)
        elif type == "cuttle":
            target_id = targets[0]["id"]
            opponent = self.get_opponent(player)
            card = player.hand[index]
            if card.id >= target_id:
                player.play(index)
                self.field.fields[opponent.name]["point"].remove([target_id])
                return False
            return True
        else:
            card = player.hand[index]
            opponent = self.get_opponent(player)
            if card.value in [1, 8, 10] and self.field.has_queen(opponent):
                if targets[0]["value"] != 12:
                    return True
            card = player.play(index)
            if card.value in [0, 1, 2, 3, 4, 5, 6, 8]:
                self.effects.append(card)
                self.targets = targets
                return True
            self.field.play_special(player, card, targets)

        return False

    def draw(self, player):
        player.draw(self.deck)

    def get_player(self, username):
        player = next(
            filter(
                lambda player: player.name == username,
                self.players
            ), None
        )
        return player

    def counter(self, player, index):
        card = player.play(index)

        if card.value != 1:
            player.add_card(card)
        else:
            self.effects.append(card)

    def move(self, player, move):
        if self.is_over():
            return False, None

        if player != self.players[(self.turn + len(self.effects)) % 2]:
            return False, None

        action = move["action"]
        print('ACTION', action)
        if action == "play":
            action_required = self.play(
                player,
                move["index"],
                move["type"],
                move["targets"]
            )

            if action_required:
                if move["type"] == "cuttle":
                    return False, None
                if len(self.effects) > 0:
                    self.oneoff = {
                        "effects": self.effects,
                        "turn": self.turn + len(self.effects),
                        "counter": False
                    }
                    return True, self.oneoff
                return False, None
        elif action == "draw":
            self.draw(player)
        elif action == "counter":
            self.counter(player, move["index"])
            self.oneoff = {
                "effects": self.effects,
                "turn": self.turn + len(self.effects),
                "counter": True
            }
            return True, self.oneoff
        elif action == "accept":
            if len(self.effects) % 2 != 0:
                card = self.effects[0]
                opponent = self.get_opponent(player)
                self.field.play_special(opponent, card, self.targets)

            self.effects = []
            self.oneoff = None

        self.turn += 1
        return True, None

    def get_state(self):
        return {
            "deck": len(self.deck),
            "turn": self.turn,
            "field": self.field,
            "discard": self.discard,
            "over": self.is_over(),
            "winner": self.field.get_winner()
        }

    def get_opponent(self, player):
        opponent = next(
            filter(
                lambda other: other != player,
                self.players
            )
        )
        return opponent

    def get_hands(self, player):
        if player:
            other = self.get_opponent(player)
            if self.field.can_see(player):
                other_hand = other.hand
            else:
                other_hand = [Card(-1, -1)] * len(other.hand)
            hands = {
                player.name: player.hand,
                other.name: other_hand
            }
        else:
            p1 = self.players[0]
            p2 = self.players[1]
            hands = {
                p1.name: [Card(-1, -1)] * len(p1.hand),
                p2.name: [Card(-1, -1)] * len(p2.hand)
            }

        return {
            "hands": hands
        }

    def get_players(self, player):
        if player:
            other = self.get_opponent(player)

            players = {
                "self": player.name,
                "other": other.name,
                "turn": self.players.index(player)
            }
        else:
            players = {
                "self": self.players[0].name,
                "other": self.players[1].name,
                "turn": -1
            }

        return {
            "players": players
        }

    def data(self):
        return {
            "turn": self.turn,
            "deck": self.deck,
            "discard": self.discard,
            "field": self.field
        }

    def get_data(self):
        return self.deck

    def is_over(self):
        return self.field.get_winner() is not None
