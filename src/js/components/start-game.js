class StartGame extends HyperHTMLElement {
    created() {
        this.text = 'start game'
        this.render()
    }

    render() {
        this.html`
<p class="db mw6 f3 pa3 mt5 center tc ttc link near-black bg-blue grow"
    onclick=${this}>${this.text}</>
`
    }

    onclick() {
        if (this.clicked) return;
        this.clicked = 1
        const {gameId, dbRef} = this._startGame()
        this._disappearAfter(1000)
    }

    _disappearAfter(timeout) {
        setTimeout(() => {
            this.text = 'enjoy the game!'
            this.render()
            this.firstElementChild.classList.add('animated', 'zoomOutUp')
        }, timeout)
    }

    _startGame() {
        const config = {
            apiKey: "AIzaSyDZscPiYk0GhygMxwCPfSCLkv8ZEgbmhHM",
            authDomain: "retail-store.firebaseapp.com",
            databaseURL: "https://retail-store.firebaseio.com",
            projectId: "firebase-retail-store",
            storageBucket: "firebase-retail-store.appspot.com",
            messagingSenderId: "518140580977"
        };
        firebase.initializeApp(config);
        const dbRef = firebase.firestore();
        const game = dbRef.collection('games').doc()
        const newGame = window.up4auction.stageGame(game.id)
        game.set(newGame)

        return {
            gameId: game.id,
            dbRef
        }
    }
}

StartGame.define('start-game')
