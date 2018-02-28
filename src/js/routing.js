import * as page from './page.js'
const {bind} = HyperHTMLElement
const app = document.getElementById('app')
// import makeGame from './game.js'

page('/', '/game')
page('/game', startGame)
page('/game/:id', mainGame)
page()

window.page = page

function startGame(ctx, next) {
    bind(app)`<start-game></start-game>`
    next()
}

// for entering into a game directly
function mainGame(ctx, next) {
    let id = ctx.params.id
    bind(app)`<main-game gameId=${id}></main-game>`
}

function notfound() {
    console.log('not found')
    hyperHTML.bind(document.body)`
    <a href="/game/start" class="db mw5 f3 pa3 mt5 center tc link near-black bg-blue grow">Start Over</a>
`
}