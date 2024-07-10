// General
const MAX_HAND = 5;
const MAX_BET = 5;
const INITIAL_COINS = 10;
const INITIAL_BET = 1;

function convertToObj(a, b) {
  if (a.length != b.length || 
      a.length == 0 || 
      b.length == 0) {
      return null;
  }
  let obj = {};
  a.forEach((k, i) => {obj[k] = b[i]});
  return obj;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Suits
const DIAMONDS = 0;
const CLUBS = 1;
const HEARTS = 2;
const SPADES = 3;

const SUITS = [
  DIAMONDS,
  CLUBS,
  HEARTS,
  SPADES
];

const SUIT_DESC = [
  "Diamonds",
  "Clubs",
  "Hearts",
  "Spades"
];

const suitDesc = convertToObj(SUITS, SUIT_DESC);

const SUIT_ICON = [
  "♦",
  "♣",
  "♥",
  "♠"
];

const suitIcon = convertToObj(SUITS, SUIT_ICON);

// Values
const ACE = 1;
const TWO = 2;
const THREE = 3;
const FOUR = 4;
const FIVE = 5;
const SIX = 6;
const SEVEN = 7;
const EIGHT = 8;
const NINE = 9;
const TEN = 10;
const JACK = 11;
const QUEEN = 12;
const KING = 13;

VALUES = [
  ACE,
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING
];

VALUES_DESC = [
  "Ace",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Jack",
  "Queen",
  "King"
];

VALUES_SIMPLE = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
];

const valueSimple = convertToObj(VALUES, VALUES_SIMPLE);
const valueDesc = convertToObj(VALUES, VALUES_DESC);

// Hands
const JACKS_OR_BETTER = 1;
const TWO_PAIR = 2;
const THREE_OF_A_KIND = 3;
const STRAIGHT = 4;
const FLUSH = 5;
const FULL_HOUSE = 6;
const FOUR_OF_A_KIND = 7;
const STRAIGHT_FLUSH = 8;
const ROYAL_FLUSH = 9;

const HANDS = [
  JACKS_OR_BETTER,
  TWO_PAIR,
  THREE_OF_A_KIND,
  STRAIGHT,
  FLUSH,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  STRAIGHT_FLUSH,
  ROYAL_FLUSH
];

const HAND_DESC = [
  "Jacks or Better",
  "Two pair",
  "Three of a kind",
  "Straight",
  "Flush",
  "Full house",
  "Four of a kind",
  "Straight flush",
  "Royal flush"
];

const handDesc = convertToObj(HANDS, HAND_DESC);

BONUS_MULTIPLIERS = {
  ROYAL_FLUSH: [250,500,750,1000,4000],
  STRAIGHT_FLUSH: [50,100,150,200,250],
  FOUR_OF_A_KIND: [25,50,75,100,125],
  FULL_HOUSE: [9,18,27,36,45],
  FLUSH: [6,12,18,24,30],
  STRAIGHT: [4,8,12,16,20],
  THREE_OF_A_KIND: [3,6,9,12,15],
  TWO_PAIR: [2,4,6,8,10],
  JACKS_OR_BETTER: [1,2,3,4,5]
}

