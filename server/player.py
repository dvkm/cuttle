

class Player:
    def __init__(self, name):
        self.hand = []
        self.name = name

    def data(self):
        return {
            "name": self.name,
            "hand": self.hand
        }

    def discard(self, index, dest_deck):
        card = self.hand.pop(index)
        dest_deck.add(card)
        return card

    def add(self, card):
        self.hand.append(card)

    def draw(self, deck):
        card = deck.draw()
        self.hand.append(card)
        return card

    def play(self, index):
        card = self.hand.pop(index)
        return card

    def __repr__(self):
        return f"<Player {self.name}>"
