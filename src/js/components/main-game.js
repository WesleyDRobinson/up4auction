import './game-board';
import './player-setup';

class MainGame extends HyperHTMLElement {
    static get observedAttributes() {
        return ['gameId']
    }

    get defaultState() {
        return {
            gameId: this.gameId,
            loadedFromFirestore: false,
            gameStarted: false,
            playerNames: null
        }
    }

    created() {
        this.render();
        // Optional: Load game from Firestore if gameId exists
        // For now, we'll just create a new game locally
        // if (!this.state.loadedFromFirestore && this.gameId) this._loadGame(this.gameId)
    }

    attributeChangedCallback() {
        this.render()
    }

    handleStartGame(e) {
        const { playerNames } = e.detail;
        this.setState({
            gameStarted: true,
            playerNames
        });
        this.render();
    }

    render() {
        const { gameStarted, playerNames } = this.state;

        if (!gameStarted) {
            const setupEl = document.createElement('player-setup');
            setupEl.addEventListener('start-game', this.handleStartGame.bind(this));
            return this.html`
                <div class="main-game">
                    ${setupEl}
                </div>
            `;
        }

        return this.html`
            <div class="main-game pa3">
                <game-board playerNames=${JSON.stringify(playerNames)}></game-board>
            </div>
        `;
    }

    _loadGame(id) {
        // Future: Load game state from Firestore
        firebase
            .firestore()
            .collection('games')
            .where('id', '==', id)
            .get()
            .then((documents) => {
                if (documents.docs.length > 0) {
                    const gameData = documents.docs[0].data();
                    console.log('loaded game from Firestore', gameData);
                    this.setState({ loadedFromFirestore: true });
                    // TODO: Pass loaded game to GameBoard component
                }
            })
            .catch((err) => console.error('could not load game :( ', err))
    }
}

MainGame.define('main-game')
