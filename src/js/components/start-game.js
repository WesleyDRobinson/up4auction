import up4auction from '../game.js'

const actions = up4auction().actions

class StartGame extends HyperHTMLElement {
    created() {
        this.text = 'start game'
        this.render()
    }

    render() {
        this.html`
            <p class="db mw6 f3 pa3 mt5 center tc ttc link near-black bg-blue pointer" onclick=${this}>
                ${this.text}
            </p>`
    }

    onclick() {
        if (this.clicked) return;
        this.clicked = 1
        this._startGame()
        this.text = 'enjoy the game!'
        this.render()
        this._disappearAfter(1000)
    }

    _disappearAfter(timeout) {
        setTimeout(() => {
            this.firstElementChild.classList.add('animated', 'zoomOutUp')
            setTimeout(() => {
                this.remove()
            }, 1000)
        }, timeout)
    }

    _startGame() {
        // stage game
        const gameId = Math.random().toString(36).slice(2, 7)
        const newGame = actions.stageGame(gameId)

        // add game to db
        const db = firebase.firestore();
        db.collection('games').add(newGame)

        // give time for animations and nav to game
        setTimeout(() => page(`/game/${newGame.id}`), 2000)
    }
}

StartGame.define('start-game')
