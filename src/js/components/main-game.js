import up4auction from '../game.js'

const {wire} = HyperHTMLElement

class MainGame extends HyperHTMLElement {
    static get observedAttributes() {
        return ['gameId', 'game', 'loaded']
    }

    get defaultState() {
        return {
            game: this.game,
            gameId: this.gameId,
            actions: up4auction().actions
        }
    }

    created() {
        if (!this.state.game && this.gameId) this._loadGame(this.gameId)
    }

    attributeChangedCallback() {
        this.render()
    }

    render() {
        let players = this.state.game.players
        this.html`
            <div id="side-panel" class="fl flex flex-column pa2 w-third">
                <h1 class="ma0 animated slideInDown">Game Id: ${this.gameId}</h1>

                <button class=${this.loaded ? 'dn' : ''} onclick=${this}>Load Game</button>
                
                <div id="players" class="flex flex-column">
                
                    ${players.map(player => wire(player)`<div class="ma1 pa2 w4 h4 bg-light-blue ba b--gold">${player.name}, ${player.propertyCards.join(', ')}</div>`)}
                    
                </div>
                
                <div class=${5 === players.length ? 'dn' : 'flex'}>
                    <input id="player-name" type="text" placeholder="player name">
                    <input type="submit" value="Add Player" data-call=addPlayer onclick=${this}>
                </div>
            </div>
            <pre class="fr">${JSON.stringify(this.state.game.players, null, 4)}</pre>
`
    }

    addPlayer() {
        let p = this.state.game.players
        let input = this.querySelector('#player-name')
        let name = input.value || `Player ${p.length + 1}`
        input.value = ''
        let newPlayer = up4auction().actions.createPlayer(p.length + 1, name)
        p.push(newPlayer)
        this.render()
    }

    onclick() {
        if (!this.loaded) {
            this._loadGame(this.gameId)
        }
    }

    _loadGame(id) {
        firebase
            .firestore()
            .collection('games')
            .where('id', '==', id)
            .get()
            .then((documents) => {
                this.setState({game: documents.docs[0].data()})

                console.log('loaded game into state', this.state.game)

                this.loaded = 1
            })
            .catch((err) => console.error('could not load game :( ', err))
    }
}

MainGame.define('main-game')
