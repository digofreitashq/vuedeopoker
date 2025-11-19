// Game Version
const version = "0.1";

const tickMilliseconds = 1000;

let sounds = {};

// Instanciate game-sound component
Vue.component("game-sound", {
  props: ["sound", "loop"],
  template: `<audio :id="'sound_'+sound" :loop="loop">
            <source :src="'./assets/'+sound+'.wav'" type="audio/wav"></source>
        </audio>`,
});

// Instanciate v-trim directive
Vue.directive("trim", {
  inserted: (el) =>
    el.firstChild &&
    el.firstChild.textContent &&
    (el.firstChild.textContent = el.firstChild.textContent.trim()),
});

// App Declaration
let app = new Vue({
  el: "#app",
  data: {
    // Game started
    gameStarted: false,
    // Game ended
    gameEnded: false,
    // The CQNS!
    list: [],
    // Current number
    currentNumber: null,
    // Guessed right
    guessed: 0,
    // Sounds
    sound_list: ["right", "success", "gameover"],
    // Time Left
    timeLeft: 0,
    // Tick Left
    ticksLeft: [],
    // Score history
    scoreHistory: [],
    // Score initials
    scoreInitials: [],
  },
  mounted: function () {
    let self = this;

    // Init sounds
    this.sound_list.forEach(function (sound_name) {
      const el = document.getElementById("sound_" + sound_name);
      if (!el) return;
      sounds[sound_name] = el;
      sounds[sound_name].volume = 0.5;
    });
    sounds["cqns-theme"] = document.getElementById("sound_cqns-theme");
    sounds["cqns-theme"].volume = 0.2;
    sounds["cqns-theme"].loop = true;

    sounds["cqns-theme"].addEventListener(
      "ended",
      function () {
        this.currentTime = 0;
        this.play();
      },
      false
    );

    // Init controls
    [
      "num0",
      "num1",
      "num2",
      "num3",
      "num4",
      "num5",
      "num6",
      "num7",
      "num8",
      "num9",
    ].forEach((key, index) => {
      keyboardJS.bind(key, (e) => {
        this.onKeyPress(index);
      });
    });
    ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].forEach((key, index) => {
      keyboardJS.bind(key, (e) => {
        this.onKeyPress(index);
      });
    });

    // Score initials
    document.addEventListener("keydown", function (event) {
      if (!self.gameEnded) return;
      if (event.key == "Backspace") {
        self.scoreInitials.pop();
      } else if (event.key == "Enter") {
        self.putScoreInitials();
      } else {
        if (self.scoreInitials.length < 4 && /^[a-zA-Z]$/.test(event.key))
          self.scoreInitials.push(event.key.toUpperCase());
      }
    });

    // Init timer
    this._tickTimer = setInterval(this.callbackTickTimer, 500);

    // Init game
    this.newNumber();
  },
  computed: {
    animationSpeed() {
      // Pulse speed
      return 1200; //this.timeLeft / 10;
    },
    finalScore() {
      const score = this.list.length - 1;
      return Math.max(0, score);
    },
    scoreInitialsComputed() {
      if (this.scoreInitials.length >= 4) return this.scoreInitials;
      let response = [...this.scoreInitials];
      while (response.length < 4) response.push("_");
      return response.splice(0, 4);
    },
    scoreHistoryComputed() {
      return this.scoreHistory.sort((a, b) => a.points > b.points);
    },
  },
  watch: {
    gameEnded(n) {
      if (!n) return;
      sounds["gameover"].play();
    },
  },
  methods: {
    gameover() {
      // Show Game Over
      this.gameEnded = true;
    },
    restart() {
      // Restart game
      this.gameStarted = false;
      this.gameEnded = false;
      this.list = [];
      this.timeLeft = 0;
      this.ticksLeft = [];
      this.newNumber();
    },
    newNumber() {
      // Generate a digit number
      const number = Math.floor(Math.random() * 10);
      this.guessed = 0;
      this.currentNumber = number;
      this.list.push(number);
      if (this._pressTimer) clearInterval(this._pressTimer);
      // Starts timer only when it generates the second digit
      if (this.list.length == 1) return;
      this.gameStarted = true;
      sounds["cqns-theme"].play();
      // 2 seconds for each digit in the sequence
      const seconds = tickMilliseconds * 2 * this.list.length;
      this._pressTimer = setTimeout(() => this.gameover(), seconds);
      this.timeLeft = seconds;
      this.ticksLeft = new Array(seconds / tickMilliseconds);
    },
    onKeyPress(number) {
      // If guessed more than the list, something is wrong. Exit
      if (this.guessed >= this.list.length) return;
      // If guessed wrong, game over
      if (number != this.list[this.guessed]) {
        sounds["gameover"].play();
        this.gameover();
      } else {
        // If guessed right
        this.guessed++;
        // If guessed right the last on the sequence
        if (this.guessed >= this.list.length) {
          sounds["success"].play();
          setTimeout(() => this.newNumber(), 200);
        } else {
          // If guessed right other digits
          sounds["right"].play();
        }
      }
    },
    callbackTickTimer() {
      this.timeLeft -= tickMilliseconds;
      if (this.ticksLeft.length) this.ticksLeft.pop();

      if (this.timeLeft <= 0) {
        this.timeLeft = 0;
        this.ticksLeft = [];
        return;
      }
    },
    formatDate(date) {
      return date.toLocaleDateString();
    },
    putScoreInitials() {
      if (this.finalScore > 0)
        this.scoreHistory.push({
          player: this.scoreInitials.join(""),
          points: this.finalScore,
          datetime: new Date(),
        });
      this.restart();
    },
  },
});
