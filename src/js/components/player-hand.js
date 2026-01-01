import './card';

class PlayerHand extends HyperHTMLElement {
  created() {
    this.render();
  }

  get defaultState() {
    return {
      player: null,
      isCurrentPlayer: false,
      phase: 'bidding',
      canSelectCard: false
    };
  }

  handleCardSelection(card) {
    if (this.state.canSelectCard) {
      this.dispatchEvent(new CustomEvent('property-selected', {
        detail: {
          player: this.state.player,
          card: card
        },
        bubbles: true
      }));
    }
  }

  renderCard(card, type, size, clickable) {
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
    const clickableClass = clickable ? 'pointer hover-shadow-2 grow' : '';
    const displayValue = type === 'money' ? (card.value === 0 ? '$0' : `$${card.value}k`) : card.value;

    return this.html`
      <div
        class="${cardSizeClass} ${bgColor} ${textColor} br3 ba bw1 ${borderColor} ${clickableClass} flex flex-column items-center justify-center pa2 ma1"
        onclick=${clickable ? () => this.handleCardSelection(card) : null}
      >
        <div class="f6 fw3 o-60 mb1">${type === 'property' ? 'Property' : '💰'}</div>
        <div class="${type === 'property' ? 'f2' : 'f3'} fw7">${displayValue}</div>
      </div>
    `;
  }

  render() {
    const { player, isCurrentPlayer, phase, canSelectCard } = this.state;

    if (!player) {
      return this.html`<div></div>`;
    }

    const highlightClass = isCurrentPlayer ? 'bg-light-blue b--blue bw2' : 'bg-white b--light-gray';
    const { propertyCards = [], moneyCards = [], coins = 0, bid = 0 } = player;

    return this.html`
      <div class="player-hand ba br3 ${highlightClass} pa3 mb3">
        <!-- Player Info Header -->
        <div class="flex items-center justify-between mb3">
          <div class="flex items-center">
            <div class="f4 fw6 ${isCurrentPlayer ? 'dark-blue' : 'dark-gray'}">
              ${player.name}
              ${isCurrentPlayer ? this.html`<span class="ml2 f6 fw4 bg-blue white br-pill ph2 pv1">YOUR TURN</span>` : ''}
            </div>
          </div>
          <div class="flex items-center">
            <span class="f5 fw5 mr3">💰 ${coins} coins</span>
            ${bid > 0 ? this.html`<span class="f6 bg-gold br-pill ph2 pv1">Current bid: ${bid}</span>` : ''}
          </div>
        </div>

        <!-- Property Cards -->
        ${propertyCards.length > 0 ? this.html`
          <div class="mb3">
            <div class="f6 fw6 mb2 gray">
              Properties (${propertyCards.length})
              ${canSelectCard && phase === 'auctioning' ? this.html`
                <span class="ml2 f7 bg-gold br-pill ph2 pv1">👆 Click to auction</span>
              ` : ''}
            </div>
            <div class="flex flex-wrap">
              ${propertyCards.map(card => this.renderCard(card, 'property', 'small', canSelectCard && phase === 'auctioning'))}
            </div>
          </div>
        ` : ''}

        <!-- Money Cards -->
        ${moneyCards.length > 0 ? this.html`
          <div>
            <div class="f6 fw6 mb2 gray">Money Earned (${moneyCards.length})</div>
            <div class="flex flex-wrap">
              ${moneyCards.map(card => this.renderCard(card, 'money', 'small', false))}
            </div>
          </div>
        ` : ''}

        <!-- Empty state for new players -->
        ${propertyCards.length === 0 && moneyCards.length === 0 ? this.html`
          <div class="tc gray i f6 pv3">
            ${phase === 'bidding' ? 'No properties yet - start bidding!' : 'No cards yet'}
          </div>
        ` : ''}
      </div>
    `;
  }
}

PlayerHand.define('player-hand');
