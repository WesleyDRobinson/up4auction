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
            ${cards.map((card, index) => this.renderCard(card, cardType, 'large', index))}
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

  renderCard(card, type, size, index) {
    const sizeClasses = {
      small: 'w3 h4',
      normal: 'w4 h5',
      large: 'w5 h6'
    };

    let bgColor, textColor, borderColor;
    if (type === 'property') {
      if (card.value <= 10) {
        bgColor = 'bg-light-red';
        borderColor = 'b--red';
      } else if (card.value <= 20) {
        bgColor = 'bg-gold';
        borderColor = 'b--yellow';
      } else {
        bgColor = 'bg-light-green';
        borderColor = 'b--green';
      }
      textColor = 'dark-gray';
    } else {
      bgColor = 'bg-dark-green';
      textColor = 'white';
      borderColor = 'b--green';
    }

    const cardSizeClass = sizeClasses[size] || sizeClasses.normal;
    const displayValue = type === 'money' ? (card.value === 0 ? '$0' : `$${card.value}k`) : card.value;

    return this.html`
      <div
        class="${cardSizeClass} ${bgColor} ${textColor} br3 ba bw1 ${borderColor} flex flex-column items-center justify-center pa2 ma1 animate__animated animate__bounceIn"
        style=${'animation-delay: ' + (index * 0.1) + 's'}
      >
        <div class="f6 fw3 o-60 mb1">${type === 'property' ? 'Property' : '💰'}</div>
        <div class="${type === 'property' ? 'f2' : 'f3'} fw7">${displayValue}</div>
      </div>
    `;
  }

  renderPlayerStatuses() {
    const { players, phase } = this.state;

    return players.map(player => {
      const { name, bid, passed, coins, active } = player;

      let statusText = '';
      let statusColor = 'bg-light-gray gray';

      if (phase === 'bidding') {
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
      } else if (phase === 'auctioning') {
        if (!active) {
          statusText = 'Selected ✓';
          statusColor = 'bg-light-green green';
        } else {
          statusText = 'Selecting...';
          statusColor = 'bg-light-gray gray';
        }
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
