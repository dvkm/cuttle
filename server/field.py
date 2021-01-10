import random

from server.card import Deck

POINT_FIELD_KEY = "point"
SPECIAL_FIELD_KEY = "special"


def is_winner(field):
    points = 0
    for card in field[POINT_FIELD_KEY]:
        if 0 <= card.value <= 9:
            points += card.value + 1

    king_to_required = {
        0: 21,
        1: 14,
        2: 10,
        3: 7,
        4: 5
    }

    kings = len(
        list(
            filter(lambda card: card.value == 12, field[SPECIAL_FIELD_KEY])
        )
    )

    required = king_to_required[kings]

    return points >= required


class Field:
    def __init__(self, players, discard, deck, game):
        self.fields = {}
        self.discard = discard
        self.deck = deck
        self.game = game

        self.others = {
            players[0].name: players[1].name,
            players[1].name: players[0].name
        }

        for player in players:
            self.fields[player.name] = {
                POINT_FIELD_KEY: Deck(),
                SPECIAL_FIELD_KEY: Deck()
            }

    def data(self):
        return self.fields

    def clear_special(self):
        for player in self.fields:
            field = self.fields[player]

            deck = field[SPECIAL_FIELD_KEY]
            while deck.has_cards():
                self.discard.add(deck.draw())

            to_be_moved = []
            for card in self.fields[player][POINT_FIELD_KEY]:
                if card.clear_stack():
                    to_be_moved.append(card)

            removed = self.fields[player][POINT_FIELD_KEY].remove(to_be_moved)
            other = self.others[player]
            for card in removed:
                self.fields[other][POINT_FIELD_KEY].add(card)

    def play_card(self, player, card, field_type):
        self.fields[player.name][field_type].add(card)

    def play_point(self, player, card):
        self.play_card(player, card, POINT_FIELD_KEY)

    def remove_from_all(self, target_ids):
        removed = []
        for player in self.fields:
            for type in [SPECIAL_FIELD_KEY, POINT_FIELD_KEY]:
                cards = self.fields[player][type].remove(target_ids)
                for card in cards:
                    removed.append(card)
        return removed

    def play_special(self, player, card, targets):
        if card.value in [7, 11, 12]:  # 8, J, Q, K (Permanent cards)
            self.play_card(player, card, SPECIAL_FIELD_KEY)
        else:
            target_ids = [target["id"] for target in targets]
            other = self.game.get_opponent(player)
            if card.value == 0:  # clear field
                self.clear_field()
            elif card.value == 1:  # 2 - discard a card
                discarded = self.remove_from_all(target_ids)
                for card in discarded:
                    self.discard.add(card)
            elif card.value == 2:  # 3 - take one card from discard pile
                removed = self.discard.remove(target_ids)
                for card in removed:
                    player.add(removed)
            elif card.value == 3:  # 4 - make opponent discard 2
                # TODO: Remove 2 targeted cards
                for _ in range(2):
                    other.discard(random.randint(
                        0, len(other.hand)), self.discard)
            elif card.value == 4:  # 5 - draw 2 cards
                for _ in range(2):
                    player.draw(self.deck)
            elif card.value == 5:  # 6 - clear special field
                self.clear_special()
            elif card.value == 6:  # 7 - draw and play immediately
                # TODO: Make user play immediately
                return player.draw(self.deck)
            elif card.value == 8:  # 9 - discard a permanent card
                discarded = self.fields[other.name][SPECIAL_FIELD_KEY].remove(
                    target_ids)
                for card in discarded:
                    self.discard.add(card)
            elif card.value == 10:  # J - steal a card
                stolen = self.fields[other.name][POINT_FIELD_KEY].remove(
                    target_ids
                )
                if len(stolen) == 1:
                    stolen[0].stack(card)
                    self.fields[player.name][POINT_FIELD_KEY].add(stolen[0])
                else:
                    stolen = self.fields[player.name][POINT_FIELD_KEY].remove(
                        target_ids
                    )
                    stolen[0].stack(card)
                    self.fields[other.name][POINT_FIELD_KEY].add(stolen[0])
                pass

    def clear_field(self):
        for player in self.fields:
            field = self.fields[player]

            deck = field[POINT_FIELD_KEY]
            while deck.has_cards():
                self.discard.add(deck.draw())

    def can_see(self, player):
        field = self.fields[player.name][SPECIAL_FIELD_KEY]
        return len(list(filter(lambda card: card.value == 7, field)))

    def has_queen(self, player):
        field = self.fields[player.name][SPECIAL_FIELD_KEY]
        return len(list(filter(lambda card: card.value == 11, field)))

    def get_winner(self):
        for player in self.fields:
            field = self.fields[player]

            if is_winner(field):
                return player

        return None
