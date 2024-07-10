class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
    }
    desc() {
        return this.valueSimple() + this.suitIcon();
    }
    valueSimple() {
        return valueSimple[this.value];
    }
    suitIcon() {
        return suitIcon[this.suit];
    }
}

class Deck {
    constructor() {
        this.cards = [];
    }
    init() {
        this.cards = [];
        VALUES.forEach((value) => {
            SUITS.forEach((suit) => {
                this.addCard(new Card(suit, value));
            });
        });
        this.shuffle();
    }
    addCard(card) {
        this.cards.push(card);
    }
    pickCard() {
        return this.cards.shift();
    }
    shuffle() {
        this.cards = this.cards
            .map(card => ({ card, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ card }) => card);
    }
    log() {
        this.cards.forEach((card) => {
            console.log(card.desc());
        });
    }
}

class Hand {
    constructor() {
        this.cards = [];
        this.hold = [];
    }
    init(deck) {
        if (!deck) return;
        this.cards = [];
        this.hold = [];
        this.drawCards(deck);
    }
    drawCards(deck) {
        Array.from({ length: MAX_HAND }, (x, i) => {
            this.addCard(deck.pickCard());
        });
    }
    addCard(card) {
        if (this.cards.length < MAX_HAND) {
            this.cards.push(card);
        }
    }
    toggleHold(index) {
        if (this.hold.indexOf(index) == -1) {
            this.hold.push(index);
        } else {
            this.hold = this.hold.filter((value) => index != value);
        };
    }
    isHold(index) {
        return (this.hold.indexOf(index) != -1);
    }
    dealDraw(deck) {
        this.cards = this.cards.map((card, index) => this.isHold(index) ? card : deck.pickCard());
        deck.init();
    }
    sortedCards() {
        return this.cards.slice(0).sort((a,b) => a.value-b.value);
    }
    has(card) {
        return this.cards.some(
            ({value, suit}) => value == card.value && suit == card.suit);
    }
    hasNext(card) {
        let nextValue = card.value == 13 ? 1 : (card.value + 1);
        return this.cards.some(
            ({value}) => value == nextValue);
    }
    getPairs() {
        let pairs = [];
        this.cards.forEach((cardA, ixa) => {
            if (ixa == MAX_HAND-1) return false;
            let filtered = this.cards.filter(
                (cardB) => cardA.value == cardB.value);
            if (filtered.length == 2 && pairs.indexOf(cardA.value) == -1) {
                pairs.push(cardA.value);
                return false;
            }
        });
        return pairs;
    }
    hasPair() {
        return this.getPairs().length > 0;
    }
    hasThree() {
        let result = null;
        this.cards.forEach((cardA, ixa) => {
            if (ixa == MAX_HAND-2) return false;
            let filtered = this.cards.filter(
                (cardB) => cardA.value == cardB.value);
            if (filtered.length == 3) {
                result = cardA.value;
                return false;
            }
        });
        return result;
    }
    hasFour() {
        let result = null;
        this.cards.forEach((cardA, ixa) => {
            if (ixa == MAX_HAND-3) return false;
            let filtered = this.cards.filter(
                (cardB) => cardA.value == cardB.value);
            if (filtered.length == 4) {
                result = cardA.value;
                return false;
            }
        });
        return result;
    }
    isFlush() {
        return (
            this.cards[0].suit == this.cards[1].suit &&
            this.cards[1].suit == this.cards[2].suit &&
            this.cards[2].suit == this.cards[3].suit &&
            this.cards[3].suit == this.cards[4].suit &&
            this.cards[4].suit == this.cards[0].suit
        );
    }
    isStraight() {
        let sortedCards = this.sortedCards();
        let validStraight = false;

        if (sortedCards[0].value == ACE && sortedCards[1].value == TWO) {
            validStraight = (
                sortedCards[2].value == THREE &&
                sortedCards[3].value == FOUR &&
                sortedCards[4].value == FIVE
            );
        } else if (sortedCards[0].value == ACE && sortedCards[4].value == KING) {
            validStraight = (
                sortedCards[1].value == TEN &&
                sortedCards[2].value == JACK &&
                sortedCards[3].value == QUEEN
            );
        } else {
            let minCardValue = sortedCards[0].value;
            validStraight = (
                sortedCards[0].value == (minCardValue + 0) &&
                sortedCards[1].value == (minCardValue + 1) &&
                sortedCards[2].value == (minCardValue + 2) &&
                sortedCards[3].value == (minCardValue + 3) &&
                sortedCards[4].value == (minCardValue + 4)
            );
        }

        return validStraight;
    }
    log() {
        this.cards.forEach((card) => {
            console.log(card.value + '/' + card.suit + ': ' + card.desc());
        });
    }
}

class Dealer {
    constructor() {
        // Nothing phrases
        this.nothing = [
            'That was close! To nothing.',
            'A pair...! Of nothing and anything.',
            'Come on... You can do better than that.',
            'No luck today, uh?',
            'Try again! And again. And again...',
            'Your average hand. Nothing!',
            'Bad news: You lose. Good news: I win!',
            'Maybe you should stop losing...',
            'Is it bad luck or just a bad player?',
            'Okay, do not cry. You lost again.',
            'You can always try again.',
            'The more you lose, the more you learn. Maybe.',
            'Keep on trying. Someday you\'ll win.',
            'Remember that day you won?',
            'Oh no! Not again...',
            'Nothing! Haha! Sorry, it\'s funny.',
            'Wait, I\'ll call my mom to show the biggest loser I know...',
            'Better hold better cards.',
            'You really thought that was a good play?',
            'Maybe... No, still a bad hand.',
            'Losing just for fun!',
            'Okay, I promise I\'ll ever joke on you again.',
            'What about you give up?',
            'What the hell you wanted to do?',
            'Come on... COME ON!',
            'The road is long for losers like you.',
            'I could be more positive, but it\'s fun to watch you lose.',
            'Did I lose? No, it was YOU!',
            'Hey! Are you smelling that? I smell a loser right there.',
            'No way. Not AGAIN.',
            'Last warning. Can you win something?',
            'That\'s it! Nothing.'
        ]

        // Test Hands
        this.royalFlushTestHand = [
            new Card(DIAMONDS, TEN),
            new Card(DIAMONDS, JACK),
            new Card(DIAMONDS, QUEEN),
            new Card(DIAMONDS, KING),
            new Card(DIAMONDS, ACE)
        ];
        this.straightFlushTestHand1 = [
            new Card(HEARTS, TEN),
            new Card(HEARTS, JACK),
            new Card(HEARTS, QUEEN),
            new Card(HEARTS, KING),
            new Card(HEARTS, ACE)
        ];
        this.straightFlushTestHand2 = [
            new Card(SPADES, TWO),
            new Card(SPADES, THREE),
            new Card(SPADES, FOUR),
            new Card(SPADES, FIVE),
            new Card(SPADES, SIX)
        ];
        this.fourOfAKindTestHand = [
            new Card(SPADES, FOUR),
            new Card(HEARTS, FOUR),
            new Card(DIAMONDS, FOUR),
            new Card(SPADES, KING),
            new Card(CLUBS, FOUR)
        ];
        this.fullHouseTestHand = [
            new Card(SPADES, FOUR),
            new Card(HEARTS, FOUR),
            new Card(DIAMONDS, KING),
            new Card(SPADES, KING),
            new Card(CLUBS, KING)
        ];
        this.flushTestHand = [
            new Card(CLUBS, TWO),
            new Card(CLUBS, FOUR),
            new Card(CLUBS, FIVE),
            new Card(CLUBS, SIX),
            new Card(CLUBS, EIGHT)
        ];
        this.straightTestHand1 = [
            new Card(SPADES, SEVEN),
            new Card(CLUBS, EIGHT),
            new Card(SPADES, FOUR),
            new Card(DIAMONDS, SIX),
            new Card(HEARTS, FIVE)
        ];
        this.straightTestHand2 = [
            new Card(DIAMONDS, ACE),
            new Card(HEARTS, QUEEN),
            new Card(CLUBS, TEN),
            new Card(DIAMONDS, JACK),
            new Card(SPADES, KING)
        ];
        this.straightTestHand3 = [
            new Card(HEARTS, ACE),
            new Card(DIAMONDS, TWO),
            new Card(HEARTS, FOUR),
            new Card(DIAMONDS, FIVE),
            new Card(SPADES, SIX)
        ];
        this.threeOfAKindTestHand = [
            new Card(HEARTS, THREE),
            new Card(SPADES, THREE),
            new Card(SPADES, FOUR),
            new Card(DIAMONDS, KING),
            new Card(CLUBS, THREE)
        ];
        this.twoPairTestHand = [
            new Card(HEARTS, ACE),
            new Card(DIAMONDS, ACE),
            new Card(SPADES, FOUR),
            new Card(DIAMONDS, KING),
            new Card(CLUBS, KING)
        ];
        this.jacksOrBetterTestHand = [
            new Card(HEARTS, ACE),
            new Card(DIAMONDS, FOUR),
            new Card(SPADES, FOUR),
            new Card(DIAMONDS, KING),
            new Card(CLUBS, ACE)
        ];
    }
    randomNothing() {
        return this.nothing[getRandomInt(this.nothing.length)];
    }
    pay(hand, bet) {
        let indexBet = bet - 1;
        if (this.royalFlush(hand)) return [BONUS_MULTIPLIERS.ROYAL_FLUSH[indexBet], handDesc[ROYAL_FLUSH]];
        if (this.straightFlush(hand)) return [BONUS_MULTIPLIERS.STRAIGHT_FLUSH[indexBet], handDesc[STRAIGHT_FLUSH]];
        if (this.fourOfAKind(hand)) return [BONUS_MULTIPLIERS.FOUR_OF_A_KIND[indexBet], handDesc[FOUR_OF_A_KIND]];
        if (this.fullHouse(hand)) return [BONUS_MULTIPLIERS.FULL_HOUSE[indexBet], handDesc[FULL_HOUSE]];
        if (this.flush(hand)) return [BONUS_MULTIPLIERS.FLUSH[indexBet], handDesc[FLUSH]];
        if (this.straight(hand)) return [BONUS_MULTIPLIERS.STRAIGHT[indexBet], handDesc[STRAIGHT]];
        if (this.threeOfAKind(hand)) return [BONUS_MULTIPLIERS.THREE_OF_A_KIND[indexBet], handDesc[THREE_OF_A_KIND]];
        if (this.twoPair(hand)) return [BONUS_MULTIPLIERS.TWO_PAIR[indexBet], handDesc[TWO_PAIR]];
        if (this.jacksOrBetter(hand)) return [BONUS_MULTIPLIERS.JACKS_OR_BETTER[indexBet], handDesc[JACKS_OR_BETTER]];
        return [0, this.randomNothing()];
    }
    royalFlush(hand) {
        return (
            hand.has(new Card(DIAMONDS, TEN)) &&
            hand.has(new Card(DIAMONDS, JACK)) &&
            hand.has(new Card(DIAMONDS, QUEEN)) &&
            hand.has(new Card(DIAMONDS, KING)) &&
            hand.has(new Card(DIAMONDS, ACE))
        )
    }
    straightFlush(hand) {
        return (
            hand.isFlush() &&
            hand.isStraight()
        );
    }
    fourOfAKind(hand) {
        return hand.hasFour();
    }
    fullHouse(hand) {
        return hand.hasPair() && hand.hasThree();
    }
    flush(hand) {
        return hand.isFlush();
    }
    straight(hand) {
        return hand.isStraight();
    }
    threeOfAKind(hand) {
        return hand.hasThree();
    }
    twoPair(hand) {
        return hand.getPairs().length == 2;
    }
    jacksOrBetter(hand) {
        return hand.getPairs().some((value) => value == ACE || value >= JACK);
    }
}