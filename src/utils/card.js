
export const VALUES = {
  0: "A",
  1: "2",
  2: "3",
  3: "4",
  4: "5",
  5: "6",
  6: "7",
  7: "8",
  8: "9",
  9: "0",
  10: "J",
  11: "Q",
  12: "K"
}

const HAS_ONEOFF = {
  0: true,
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: false,
  8: true,
  9: false,
  10: false,
  11: false,
  12: false,
  13: false
}

const HAS_TARGET = {
  0: false,
  1: true,
  2: true,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
  8: true,
  9: false,
  10: true,
  11: false,
  12: false,
  13: false
}

const TARGETS = {
  1: {
    count: 1,
    mode: [],
  },
  2: {
    count: 1,
    mode: ["discard"],
  },
  8: {
    count: 1,
    mode: [],
  },
  10: {
    count: 1,
    mode: ["point"],
  },
}

const HAS_PERMANENT = {
  0: false,
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: true,
  8: false,
  9: false,
  10: true,
  11: true,
  12: true,
  13: false
}

export const SUITS = {
  0: "C",
  1: "D",
  2: "H",
  3: "S",
}

export const TOOLTIPS = {
  13: "Tooltip not found",
  0: "Remove all point cards from both fields",
  1: "Remove a special card from the field",
  2: "Look through the discard pile and take a card of your choice",
  3: "Your opponent needs to discard 2 cards of their choice from their hand",
  4: "Draw two cards",
  5: "Scrap all special effect cards from the table for both yourself and your opponent",
  6: "Draw a card and play it immediately",
  7: "Your opponent's will play with their hand exposed",
  8: "Return a special card back to the controller's hand",
  9: "Can only be played as a point card",
  10: "Transfer control of a point card",
  11: "Protects your cards against the effects of 2, 9, and J",
  12: "Reduces the number of points you need to win (1 - 14 points, 2 - 10 points, 3 - 7 points, 4 - 5 points)"
}

export function getCardImage(card) {
    if (card?.value === -1) {
      return 'https://opengameart.org/sites/default/files/card%20back%20red.png'
    }
    const value = VALUES[card?.value ?? 12];
    const suit = SUITS[card?.suit ?? 3];

    return `https://deckofcardsapi.com/static/img/${value}${suit}.png`;
}

export function getTooltip(card) {
  return TOOLTIPS[card?.value ?? 13];
}

export function hasOneoff(card) {
  const value = card?.value ?? 13;

  return HAS_ONEOFF[value];
}

export function hasPermanent(card) {
  const value = card?.value ?? 13;

  return HAS_PERMANENT[value];
}

export function hasTarget(card) {
  const value = card?.value ?? 13;

  return HAS_TARGET[value];
}

export function hasPoint(card) {
  const value = card?.value ?? 13;

  return value < 10;
}

export function getTargets(card) {
  const value = card?.value ?? 13;

  return TARGETS[value];
}

export function canCuttle(card, opponentCards) {
  const value = card?.value ?? 13;

  if (value >= 10) {
    return false;
  }

  return (opponentCards ?? []).filter((c) => c.id < card?.id ?? 0).length > 0
}

