// Sounds
var sounds = {};

// Execution Queue variables
var queue_manager = null;

// <game-sound>
Vue.component('game-sound', {
    props:['sound','loop'],
    template: `<audio :id="'sound_'+sound" :loop="loop">
            <source :src="'./assets/'+sound+'.wav'" type="audio/wav"></source>
        </audio>`
});

// App Declaration
var app = new Vue({
    el: '#app',
    data: {
        // Game Version
        version: '0.1',

        // Coins
        coins: INITIAL_COINS,

        // Bet
        bet: INITIAL_BET,
        
        // Hand Cards
        hand: null,

        // Deck
        deck: null,

        // Game Result
        result: "",

        // Game Control
        sound_list: [
            ['theme', true],
            ['bet', false],
            ['maxBet', false],
            ['hold', false],
            ['draw', false],
            ['denied', false],
            ['nothing', false],
            ['prize', false],
            ['restart', false],
        ]
    },
    mounted: function () {
        // Start sounds
        this.sound_list.forEach(function(sound_name){
            sounds[sound_name[0]] = document.getElementById(
                'sound_'+sound_name[0]
            );

            if (sound_name[0] == "theme") {
                sounds[sound_name[0]].volume = 0.2;
                sounds[sound_name[0]].addEventListener('ended', function () {
                    this.currentTime = 0;
                    this.play();
                }, false);
            }
        });

        // // Play Theme
        if (sounds['theme'].paused) sounds['theme'].play();

        // Initialize Game
        this.deck = new Deck();
        this.hand = new Hand();
        this.dealer = new Dealer();
        
        // Reset variables
        this.restart();

        // Keyboard Binding
        ['1','2','3','4','5'].forEach((key, index) => {
            keyboardJS.bind(key, (e) => {
                this.toggleHoldCard(index);
            });
        });

        ['num1','num2','num3','num4','num5'].forEach((key, index) => {
            keyboardJS.bind(key, (e) => {
                this.toggleHoldCard(index);
            });
        });

        ['up','plus','numadd'].forEach((key) => {
            keyboardJS.bind(key, (e) => {
                this.upBet();
            });
        });

        ['comma','period','0','numdecimal','numzero'].forEach((key) => {
            keyboardJS.bind(key, (e) => {
                this.maxBet();
            });
        });

        ['enter','space','numenter'].forEach((key) => {
            keyboardJS.bind(key, (e) => {
                if (!this.gameover) this.dealDraw();
                else this.restart();
            });
        });
    },
    computed: {
        fullBet() {
            return this.bet == MAX_BET || this.coins == 0;
        },
        gameover() {
            return this.coins <= 0 && this.result != '';
        }
    },
    methods: {
        upBet() {
            if (this.bet < MAX_BET && this.coins > 0) {
                sounds['bet'].play();
                this.coins--;
                this.bet++;
            } else {
                sounds['denied'].pause();
                sounds['denied'].currentTime = 0;
                sounds['denied'].play();
            }
        },
        maxBet() {
            let possible_bet = Math.min(this.coins, (MAX_BET-this.bet));
            if (possible_bet > 0) {
                sounds['maxBet'].play();
                this.coins -= possible_bet;
                this.bet += possible_bet;
            } else {
                sounds['denied'].pause();
                sounds['denied'].currentTime = 0;
                sounds['denied'].play();
            }
        },
        dealDraw() {
            if (!this.result) {
                this.hand.dealDraw(this.deck);
                let payed = this.dealer.pay(this.hand, this.bet);

                if (payed[0] > 0) {
                    sounds['prize'].play();
                } else {
                    sounds['nothing'].play();
                }

                this.coins += payed[0];
                this.bet = 0;
                this.result = payed[1];
            } else {
                sounds['draw'].play();
                this.bet = INITIAL_BET;
                this.coins -= this.bet;
                this.deck.init();
                this.hand.init(this.deck);
                this.result = "";
            }
        },
        toggleHoldCard(index) {
            if (this.result) return;
            sounds['hold'].pause();
            sounds['hold'].currentTime = 0;
            sounds['hold'].play();
            this.hand.toggleHold(index);
        },
        isHold(index) {
            return this.hand.isHold(index);
        },
        restart() {
            sounds['restart'].play();
            this.deck.init();
            this.hand.init(this.deck);

            this.bet = INITIAL_BET;
            this.coins = INITIAL_COINS - this.bet;
            this.result = "";
        }
    }
});