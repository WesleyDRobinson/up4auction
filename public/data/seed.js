const fs = require('fs')
let cards = []

let card = {
    id: 0,
    type: '',
    name: '',
    value: '',
    description: ''
}

// [x] - property cards 1 - 30
// value cards, 0 - 15

let i = 16
while (i--) {
    card.id = `money-${i}`
    card.type = 'money'
    card.value = i

    cards.push(JSON.stringify(card))
}

let file = ''
fs.writeFile(file, cards, (err) => {
    if (err) return console.error('failed', err)
    console.log(`${file} was written with ${cards}`)
})
