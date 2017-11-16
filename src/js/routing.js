import * as page from './page.js'
// import makeGame from './game.js'

page('*', transition)
page('/', '/game')
page('/game', startGame)
page('/game/:id', (ctx) => {
    console.log('page: game/:id:', ctx)
})
page()

window.page = page

function transition(ctx, next) {
    if (ctx.init) {
        console.log('page: initializing', ctx)
    } else {
        console.log('page: transitioning', ctx)
        next()
    }
}

function startGame(ctx, next) {
    console.log('page: start game')
    next()
}

function notfound() {
    console.log('not found')
    hyperHTML.bind(document.body)`
    <a href="/game/start" class="db mw5 f3 pa3 mt5 center tc link near-black bg-blue grow">Start Over</a>
`
}