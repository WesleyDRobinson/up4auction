class Card extends HyperHTMLElement {
  created() {
    this.render();
  }

  get defaultState() {
    return {
      card: null,
      type: 'property', // 'property' or 'money'
      size: 'normal', // 'small', 'normal', 'large'
      selected: false,
      clickable: false
    };
  }

  onCardClick() {
    if (this.state.clickable && this.state.card) {
      this.dispatchEvent(new CustomEvent('card-selected', {
        detail: { card: this.state.card },
        bubbles: true
      }));
    }
  }

  render() {
    const { card, type, size, selected, clickable } = this.state;

    if (!card) {
      return this.html`<div class="card-placeholder"></div>`;
    }

    // Size classes
    const sizeClasses = {
      small: 'w3 h4',
      normal: 'w4 h5',
      large: 'w5 h6'
    };

    // Color scheme based on value
    let bgColor, textColor, borderColor;

    if (type === 'property') {
      // Property cards: gradient based on value (1-30)
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
      // Money cards: green color scheme
      bgColor = 'bg-dark-green';
      textColor = 'white';
      borderColor = 'b--green';
    }

    const selectedClass = selected ? 'ba bw2 b--blue shadow-3' : 'ba bw1';
    const clickableClass = clickable ? 'pointer hover-shadow-2 grow' : '';
    const cardSizeClass = sizeClasses[size] || sizeClasses.normal;

    return this.html`
      <div
        class="${cardSizeClass} ${bgColor} ${textColor} br3 ${selectedClass} ${borderColor} ${clickableClass} flex flex-column items-center justify-center pa2 ma1 relative"
        onclick=${clickable ? this.onCardClick.bind(this) : null}
      >
        ${type === 'property' ? this.renderProperty() : this.renderMoney()}
      </div>
    `;
  }

  renderProperty() {
    const { card } = this.state;
    return this.html`
      <div class="f6 fw3 o-60 mb1">Property</div>
      <div class="f2 fw7">${card.value}</div>
    `;
  }

  renderMoney() {
    const { card } = this.state;
    // Display in thousands (e.g., $5k, $10k)
    const displayValue = card.value === 0 ? '$0' : `$${card.value}k`;
    return this.html`
      <div class="f6 fw3 o-80 mb1">💰</div>
      <div class="f3 fw7">${displayValue}</div>
    `;
  }
}

Card.define('game-card');
