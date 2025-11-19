import makeGame from '../game';
import './current-round';
import './player-hand';
import './bidding-interface';

class GameBoard extends HyperHTMLElement {
  created() {
    this.gameFactory = makeGame();
    this.game = this.gameFactory.game;
    this.actions = this.gameFactory.actions;
    this.currentPlayerId = 1; // For demo, player 1 is the human player

    // Initialize the game
    this.initializeGame();
    this.render();
  }

  get defaultState() {
    return {
      game: null,
      currentPlayerId: 1,
      message: null,
      winner: null
    };
  }

  initializeGame() {
    // Start bidding phase and first round
    this.actions.startBiddingPhase(this.game);
    this.actions.startRound(this.game);
    this.setState({ game: this.game });
  }

  handleBid(e) {
    const amount = e.detail.amount;
    const currentPlayer = this.actions.getCurrentPlayer(this.game);

    if (currentPlayer.id !== this.state.currentPlayerId) {
      this.setState({ message: 'Not your turn!' });
      return;
    }

    const result = this.actions.bid(this.game, currentPlayer, amount);

    if (result) {
      this.setState({ message: result });
    } else {
      this.setState({ message: `Bid ${amount} placed!` });
      this.checkRoundComplete();
    }

    this.render();
  }

  handlePass(e) {
    const currentPlayer = this.actions.getCurrentPlayer(this.game);

    if (currentPlayer.id !== this.state.currentPlayerId) {
      this.setState({ message: 'Not your turn!' });
      return;
    }

    this.actions.pass(this.game, currentPlayer);
    this.setState({ message: `${currentPlayer.name} passed` });
    this.checkRoundComplete();
    this.render();
  }

  handlePropertySelected(e) {
    const { player, card } = e.detail;

    if (player.id !== this.state.currentPlayerId) {
      this.setState({ message: 'Not your turn!' });
      return;
    }

    // In auction phase, selecting a property to sell
    this.actions.selectAuctionCard(this.game, player, card.id);
    this.setState({ message: `${player.name} is selling property ${card.value}` });
    this.render();
  }

  checkRoundComplete() {
    if (this.actions.isRoundComplete(this.game)) {
      this.actions.completeRound(this.game);

      // Check if we need to transition to next round or next phase
      if (this.game.phase === 'bidding' && this.game.propertyCards.length === 0) {
        // Bidding phase complete, move to auctioning
        this.transitionToAuctioning();
      } else if (this.game.phase === 'auctioning' && this.game.moneyCards.length === 0) {
        // Game complete
        this.endGame();
      } else {
        // Start next round
        setTimeout(() => {
          this.actions.startRound(this.game);
          this.setState({ message: `Round ${this.game.round.number} started!` });
          this.render();
        }, 1500);
      }
    }
  }

  transitionToAuctioning() {
    this.setState({ message: 'Bidding phase complete! Starting auction phase...' });
    setTimeout(() => {
      this.actions.startAuctioningPhase(this.game);
      this.actions.startRound(this.game);
      this.setState({
        message: 'Auction phase: Sell your properties for money!',
        game: this.game
      });
      this.render();
    }, 2000);
  }

  endGame() {
    const winnerMessage = this.actions.score(this.game);
    this.game.completed = true;
    this.setState({
      message: 'Game Over!',
      winner: winnerMessage,
      game: this.game
    });
    this.render();
  }

  render() {
    const { game, currentPlayerId, message, winner } = this.state;

    if (!game) {
      return this.html`<div class="tc pa4">Loading game...</div>`;
    }

    if (game.completed) {
      return this.renderGameComplete();
    }

    const currentPlayer = this.actions.getCurrentPlayer(game);
    const isMyTurn = currentPlayer && currentPlayer.id === currentPlayerId;

    return this.html`
      <div class="game-board pa3">
        <!-- Game Header -->
        <div class="game-header bb b--light-gray pb3 mb4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="f3 fw6 ma0 mb2">For Sale</h2>
              <div class="f6 gray">
                Game ID: ${game.id} | Phase: ${game.phase} | Round: ${game.round.number}
              </div>
            </div>
            <div class="tr">
              ${currentPlayer ? this.html`
                <div class="f5 fw6 ${isMyTurn ? 'dark-blue' : 'gray'}">
                  Current Player: ${currentPlayer.name}
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- Message Banner -->
        ${message ? this.html`
          <div class="bg-light-yellow gold pa3 br3 mb3 tc fw5 animate__animated animate__fadeIn">
            ${message}
          </div>
        ` : ''}

        <!-- Current Round Display -->
        ${this.renderCurrentRound()}

        <!-- Bidding Interface (only for current player) -->
        ${isMyTurn ? this.renderBiddingInterface() : ''}

        <!-- All Player Hands -->
        <div class="player-hands mt4">
          <h3 class="f4 fw6 mb3">Players</h3>
          ${game.players.map(player => this.renderPlayerHand(player))}
        </div>
      </div>
    `;
  }

  renderCurrentRound() {
    const { game } = this.state;
    const roundEl = document.createElement('current-round');
    roundEl.state = {
      round: game.round,
      players: game.players,
      phase: game.phase
    };
    return roundEl;
  }

  renderBiddingInterface() {
    const { game, currentPlayerId } = this.state;
    const currentPlayer = this.actions.getCurrentPlayer(game);
    const isMyTurn = currentPlayer && currentPlayer.id === currentPlayerId;

    const interfaceEl = document.createElement('bidding-interface');
    interfaceEl.state = {
      player: currentPlayer,
      maxCoins: currentPlayer.coins,
      currentBid: currentPlayer.bid,
      highestBid: game.round.bid,
      isMyTurn,
      phase: game.phase
    };

    // Add event listeners
    interfaceEl.addEventListener('place-bid', this.handleBid.bind(this));
    interfaceEl.addEventListener('pass-turn', this.handlePass.bind(this));

    return interfaceEl;
  }

  renderPlayerHand(player) {
    const { game, currentPlayerId } = this.state;
    const currentPlayer = this.actions.getCurrentPlayer(game);
    const isCurrentPlayer = currentPlayer && currentPlayer.id === player.id;
    const canSelectCard = player.id === currentPlayerId && game.phase === 'auctioning' && isCurrentPlayer;

    const handEl = document.createElement('player-hand');
    handEl.state = {
      player,
      isCurrentPlayer,
      phase: game.phase,
      canSelectCard
    };

    if (canSelectCard) {
      handEl.addEventListener('property-selected', this.handlePropertySelected.bind(this));
    }

    return handEl;
  }

  renderGameComplete() {
    const { game, winner } = this.state;

    // Sort players by net worth
    const sortedPlayers = [...game.players].sort((a, b) => b.netWorth - a.netWorth);

    return this.html`
      <div class="game-complete tc pa4">
        <h1 class="f1 fw7 mb4 animate__animated animate__bounceIn">🎉 Game Over! 🎉</h1>

        <div class="f3 fw6 mb4 dark-blue">
          ${winner}
        </div>

        <!-- Leaderboard -->
        <div class="leaderboard bg-white ba b--light-gray br3 pa4 mw6 center">
          <h3 class="f4 fw6 mb3">Final Scores</h3>
          ${sortedPlayers.map((player, index) => this.html`
            <div class="player-score flex items-center justify-between pa3 mb2 ${index === 0 ? 'bg-gold' : 'bg-light-gray'} br3">
              <div class="flex items-center">
                <span class="f3 fw7 mr3">${index + 1}</span>
                <div>
                  <div class="f5 fw6">${player.name}</div>
                  <div class="f7 gray">
                    ${player.coins} coins + ${player.moneyCards.reduce((sum, c) => sum + c.value, 0)}k money
                  </div>
                </div>
              </div>
              <div class="f4 fw7">${player.netWorth}</div>
            </div>
          `)}
        </div>

        <button
          onclick=${() => window.location.reload()}
          class="mt4 bg-blue white bn br3 pa3 pointer hover-bg-dark-blue f5 fw6"
        >
          Play Again
        </button>
      </div>
    `;
  }
}

GameBoard.define('game-board');
