import * as page from './page.js'
import makeGame from './game.js'

page('*', transition)
page('/', landing)
page('/game/start', startGame)
page('/game/:id', (ctx) => {
    console.log('game/:id:', ctx)
})
page('*', notfound)
page()

function transition(ctx, next) {
    if (ctx.init) {
        console.log('initializing', ctx)
        next()
    } else {
        console.log('transitioning', ctx)
        next()
    }
}

function landing() {
    console.log('landed')
}

function startGame() {
    console.log('start game!')
    window.addEventListener('game created', (e) => console.log(e.detail))
    let game = makeGame()
    let gameCreated = new CustomEvent('game created', {detail: game});
    window.dispatchEvent(gameCreated)
}

function notfound() {
    console.log('not found')
}