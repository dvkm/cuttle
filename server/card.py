import random


values = {
    0: "Ace",
    1: "2",
    2: "3",
    3: "4",
    4: "5",
    5: "6",
    6: "7",
    7: "8",
    8: "9",
    9: "10",
    10: "Jack",
    11: "Queen",
    12: "King"
}

suits = {
    0: "Clubs",
    1: "Diamonds",
    2: "Hearts",
    3: "Spades",
}


class Card:
    def __init__(self, suit, value):
        self.id = value * 4 + suit
        self.suit = suit
        self.value = value
        self.stacked = []

    def __repr__(self):
        return f"<Card {values[self.value]} {suits[self.suit]}>"

    def data(self):
        return {
            "id": self.id,
            "suit": self.suit,
            "value": self.value,
            "stacked": self.stacked
        }

    def stack(self, card):
        self.stacked.append(card)

    def clear_stack(self):
        if len(self.stacked) % 2 == 1:
            self.stacked = []
            return True

        self.stacked = []
        return False


class Deck:
    def __init__(self):
        self.cards = []

    def data(self):
        return {
            "cards": self.cards
        }

    def __iter__(self):
        self.n = 0
        return self

    def __next__(self):
        if self.n < len(self.cards):
            result = self.cards[self.n]
            self.n += 1
            return result
        else:
            raise StopIteration

    def __len__(self):
        return len(self.cards)

    def shuffle(self):
        random.shuffle(self.cards)

    def add(self, card: Card):
        self.cards.append(card)

    def draw(self):
        return self.cards.pop()

    def has_cards(self):
        return len(self.cards) > 0

    def remove(self, cards):
        removed = []
        for card in self.cards:
            if card.id in cards or card in cards:
                self.cards.remove(card)
                removed.append(card)

        return removed

    def __repr__(self):
        return f"<Deck len: {len(self.cards)}>"
