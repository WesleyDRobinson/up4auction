import './card';

class CurrentRound extends HyperHTMLElement {
  created() {
    this.render();
  }

  get defaultState() {
    return {
      round: null,
      players: [],
      phase: 'bidding'
    };
  }

  render() {
    const { round, players, phase } = this.state;

    if (!round) {
      return this.html`
        <div class="current-round bg-light-gray br3 pa4 tc">
          <div class="f4 fw5 gray">Waiting to start round...</div>
        </div>
      `;
    }

    const { cards = [], type } = round;
    const cardType = type === 'property' ? 'property' : 'money';

    return this.html`
      <div class="current-round bg-white ba b--light-gray br3 pa4 mb4">
        <!-- Round Header -->
        <div class="tc mb4">
          <div class="f6 fw6 ttu tracked gray mb2">
            ${phase === 'bidding' ? '🏠 Bidding Phase' : '💰 Auction Phase'}
          </div>
          <div class="f4 fw6 dark-gray">
            Round ${round.number}
          </div>
        </div>

        <!-- Cards Being Bid On -->
        <div class="mb4">
          <div class="f6 fw6 mb3 gray tc">
            ${phase === 'bidding' ? 'Properties Available' : 'Money Cards Available'}
          </div>
          <div class="flex justify-center flex-wrap animate__animated animate__fadeInUp">
            ${cards.map((card, index) => {
              const cardEl = document.createElement('game-card');
              cardEl.state = {
                card,
                type: cardType,
                size: 'large',
                clickable: false,
                selected: false
              };
              cardEl.style.animationDelay = `${index * 0.1}s`;
              cardEl.classList.add('animate__animated', 'animate__bounceIn');
              return cardEl;
            })}
          </div>
        </div>

        <!-- Player Bids/Status -->
        <div class="bt b--light-gray pt3">
          <div class="f6 fw6 mb3 gray">Player Status</div>
          <div class="flex flex-wrap justify-center">
            ${this.renderPlayerStatuses()}
          </div>
        </div>
      </div>
    `;
  }

  renderPlayerStatuses() {
    const { players, phase } = this.state;

    return players.map(player => {
      const { name, bid, passed, coins } = player;

      let statusText = '';
      let statusColor = 'bg-light-gray gray';

      if (passed) {
        statusText = 'PASSED';
        statusColor = 'bg-light-red red';
      } else if (bid > 0) {
        statusText = `Bid: ${bid}`;
        statusColor = 'bg-light-yellow gold';
      } else {
        statusText = 'Thinking...';
        statusColor = 'bg-light-gray gray';
      }

      return this.html`
        <div class="player-status ma2 pa3 br3 ba b--light-gray bg-white" style="min-width: 150px;">
          <div class="f6 fw6 mb2 dark-gray">${name}</div>
          <div class="f6 fw5 mb1 ${statusColor} br-pill ph2 pv1 tc">
            ${statusText}
          </div>
          <div class="f7 gray mt2">
            💰 ${coins} coins
          </div>
        </div>
      `;
    });
  }
}

CurrentRound.define('current-round');
