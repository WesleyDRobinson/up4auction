import _ from 'lodash'
export default function makeGame () {

// components
    const propertyCards = [{"id": "property-30", "type": "property", "name": "", "value": 30, "description": ""}, {"id": "property-29", "type": "property", "name": "", "value": 29, "description": ""}, {"id": "property-28", "type": "property", "name": "", "value": 28, "description": ""}, {"id": "property-27", "type": "property", "name": "", "value": 27, "description": ""}, {"id": "property-26", "type": "property", "name": "", "value": 26, "description": ""}, {"id": "property-25", "type": "property", "name": "", "value": 25, "description": ""}, {"id": "property-24", "type": "property", "name": "", "value": 24, "description": ""}, {"id": "property-23", "type": "property", "name": "", "value": 23, "description": ""}, {"id": "property-22", "type": "property", "name": "", "value": 22, "description": ""}, {"id": "property-21", "type": "property", "name": "", "value": 21, "description": ""}, {"id": "property-20", "type": "property", "name": "", "value": 20, "description": ""}, {"id": "property-19", "type": "property", "name": "", "value": 19, "description": ""}, {"id": "property-18", "type": "property", "name": "", "value": 18, "description": ""}, {"id": "property-17", "type": "property", "name": "", "value": 17, "description": ""}, {"id": "property-16", "type": "property", "name": "", "value": 16, "description": ""}, {"id": "property-15", "type": "property", "name": "", "value": 15, "description": ""}, {"id": "property-14", "type": "property", "name": "", "value": 14, "description": ""}, {"id": "property-13", "type": "property", "name": "", "value": 13, "description": ""}, {"id": "property-12", "type": "property", "name": "", "value": 12, "description": ""}, {"id": "property-11", "type": "property", "name": "", "value": 11, "description": ""}, {"id": "property-10", "type": "property", "name": "", "value": 10, "description": ""}, {"id": "property-9", "type": "property", "name": "", "value": 9, "description": ""}, {"id": "property-8", "type": "property", "name": "", "value": 8, "description": ""}, {"id": "property-7", "type": "property", "name": "", "value": 7, "description": ""}, {"id": "property-6", "type": "property", "name": "", "value": 6, "description": ""}, {"id": "property-5", "type": "property", "name": "", "value": 5, "description": ""}, {"id": "property-4", "type": "property", "name": "", "value": 4, "description": ""}, {"id": "property-3", "type": "property", "name": "", "value": 3, "description": ""}, {"id": "property-2", "type": "property", "name": "", "value": 2, "description": ""}, {"id": "property-1", "type": "property", "name": "", "value": 1, "description": ""}]
    const moneyCards = [{"id": "money-15", "type": "money", "name": "", "value": 15, "description": ""}, {"id": "money-14", "type": "money", "name": "", "value": 14, "description": ""}, {"id": "money-13", "type": "money", "name": "", "value": 13, "description": ""}, {"id": "money-12", "type": "money", "name": "", "value": 12, "description": ""}, {"id": "money-11", "type": "money", "name": "", "value": 11, "description": ""}, {"id": "money-10", "type": "money", "name": "", "value": 10, "description": ""}, {"id": "money-9", "type": "money", "name": "", "value": 9, "description": ""}, {"id": "money-8", "type": "money", "name": "", "value": 8, "description": ""}, {"id": "money-7", "type": "money", "name": "", "value": 7, "description": ""}, {"id": "money-6", "type": "money", "name": "", "value": 6, "description": ""}, {"id": "money-5", "type": "money", "name": "", "value": 5, "description": ""}, {"id": "money-4", "type": "money", "name": "", "value": 4, "description": ""}, {"id": "money-3", "type": "money", "name": "", "value": 3, "description": ""}, {"id": "money-2", "type": "money", "name": "", "value": 2, "description": ""}, {"id": "money-0", "type": "money", "name": "", "value": 0, "description": ""}]

// functions
    const getRandomNumber = () => {
        let rands = new Uint32Array(1)
        window.crypto.getRandomValues(rands)
        return rands[0]
    }
    const getLowestCard = (cards) => {
        return cards.reduce((low, card) => card.value < low.value ? card : low, cards[0])
    }

    const createPlayer = (id, name) => {
        return {
            id,
            name,
            active: false,
            coins: 0,
            bid: 0,
            propertyCards: [],
            moneyCards: [],
            netWorth: 0,
            victory: false
        }
    }

    const stageGame = (id) => {

        const _createPlayers = () => {
            let p = game.players

            p.set('player1', createPlayer(1, 'Player One'))
            p.set('player2', createPlayer(2, 'Player Two'))
            p.set('player3', createPlayer(3, 'Player Three'))

            game.playerCount = p.size
        }

        const _doleCoins = () => {
            let coinsPer = game.playerCount < 3 ? 18 : 14
            game.players.forEach((player) => {
                if (player === null) return;
                player.coins = coinsPer
            })
        }

        const _setCards = () => {
            // 3p = 8c
            // 4p = 7c
            // 5p = 6c
            // 6p = 5c
            let n = 0
            let count = game.playerCount
            if (count === 3) n = 6
            if (count === 4) n = 2

            let shuffledProps = _.shuffle(game.propertyCards)
            let shuffledMoneies = _.shuffle(game.moneyCards)
            while (n--) {
                game.removed.push(shuffledProps.pop())
                game.removed.push(shuffledMoneies.pop())
            }
            game.propertyCards = shuffledProps
            game.moneyCards = shuffledMoneies
        }

        let game = {
            id,
            type: 'up-for-auction',
            propertyCards: propertyCards,
            moneyCards: moneyCards.concat(moneyCards),
            removed: [],
            round: {
                number: 0,
                type: '', // 'bidding' or 'auctioning'
                cards: []
            },
            phase: '',
            completed: false,
            playerCount: 0,
            players: new Map()
        }

        _createPlayers()
        _doleCoins()
        _setCards()

        return game
    }

    const startBiddingPhase = (g) => {
        g.phase = 'bidding'
    }

    const startAuctioningPhase = (g) => {
        g.phase = 'auctioning'
    }

    const startRound = (g) => {
        let n = g.playerCount
        let r = g.round
        r.number += 1
        r.type = g.phase

        while (n--) {
            if (g.phase === 'bidding'){
                g.round.bid = 0
                r.cards.push(g.propertyCards.pop())
            } else if (g.phase === 'auctioning') {
                r.cards.push(g.moneyCards.pop())
            } else {
                throw new Error('cannot startRound(game) because no game.phase specified')
            }
        }
        g.players.forEach(p => {p.active = true})
    }

    const pass = (g, player) => {
        if (!g || !player) return 'missing game or player parameter'
        let cards = g.round.cards
        if (cards.length < 1) return 'round over'

        let card = getLowestCard(cards)
        g.round.cards = _.difference(cards, [card])
        let p = g.players.get(player)
        p.propertyCards.push(card)

        p.coins -= cards.length === 1 || p.bid === 1 ? p.bid : Math.floor(p.bid / 2)
        p.bid = 0
        p.active = false
    }

    const bid = (g, player, amount) => {
        if (typeof amount !== 'number') return 'could not process bid'

        let p = g.players.get(player)
        let rB = g.round.bid
        if (amount > rB) {
            g.round.bid = amount
            p.bid = amount
        } else {
            console.error('bid must be larger than current bid')
        }
    }

    const selectAuctionCard = (g, player, cardId = p.propertyCards[0].id) => {
        let p = g.players.get(player)
        return _.remove(p.propertyCards, card => card.id === cardId)
    }

    const score = (g) => {
        let winner = 'no one'
        let most = 0
        g.players.forEach(p => {
            p.netWorth = p.coins + p.moneyCards.reduce((sum, card) => sum + card.value, 0)
            if (p.netWorth > most) {
                most = p.netWorth
                winner = p.id
            }
        })
        return `${winner} is the winner`
    }

    return {
        game: stageGame(getRandomNumber()),
        actions: {
            getRandomNumber,
            getLowestCard,
            createPlayer,
            stageGame,
            startBiddingPhase,
            startAuctioningPhase,
            startRound,
            pass,
            bid,
            selectAuctionCard,
            score
        }
    }
}
