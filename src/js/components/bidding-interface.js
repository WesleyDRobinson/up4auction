class BiddingInterface extends HyperHTMLElement {
  created() {
    this.bidAmount = 0;
    this.render();
  }

  get defaultState() {
    return {
      player: null,
      maxCoins: 0,
      currentBid: 0,
      highestBid: 0,
      isMyTurn: false,
      phase: 'bidding',
      error: null
    };
  }

  handleBidInput(e) {
    const value = parseInt(e.target.value) || 0;
    this.bidAmount = value;
    this.validateBid(value);
  }

  validateBid(amount) {
    const { maxCoins, highestBid, currentBid } = this.state;
    let error = null;

    if (amount <= 0) {
      error = 'Bid must be greater than 0';
    } else if (amount > maxCoins) {
      error = `You only have ${maxCoins} coins`;
    } else if (amount <= highestBid && amount <= currentBid) {
      error = `Bid must be higher than current bid (${Math.max(highestBid, currentBid)})`;
    }

    this.setState({ error });
    return !error;
  }

  handleBid() {
    const { isMyTurn } = this.state;

    if (!isMyTurn) {
      this.setState({ error: 'Not your turn!' });
      return;
    }

    if (this.validateBid(this.bidAmount)) {
      this.dispatchEvent(new CustomEvent('place-bid', {
        detail: { amount: this.bidAmount },
        bubbles: true
      }));
      this.bidAmount = 0;
      this.setState({ error: null });
    }
  }

  handlePass() {
    const { isMyTurn } = this.state;

    if (!isMyTurn) {
      this.setState({ error: 'Not your turn!' });
      return;
    }

    this.dispatchEvent(new CustomEvent('pass-turn', {
      bubbles: true
    }));
    this.setState({ error: null });
  }

  render() {
    const { player, isMyTurn, maxCoins, highestBid, currentBid, phase, error } = this.state;

    if (!player || !isMyTurn) {
      return this.html`
        <div class="bidding-interface bg-light-gray br3 pa4 tc">
          <div class="f5 gray">
            ${!isMyTurn ? 'Waiting for other players...' : 'Not your turn'}
          </div>
        </div>
      `;
    }

    const minBid = Math.max(highestBid, currentBid) + 1;
    const suggestedBids = this.getSuggestedBids(minBid, maxCoins);

    return this.html`
      <div class="bidding-interface bg-white ba b--blue bw2 br3 pa4">
        <div class="f4 fw6 mb3 dark-blue tc">Your Turn to ${phase === 'bidding' ? 'Bid' : 'Act'}</div>

        ${phase === 'bidding' ? this.html`
          <!-- Bid Input Section -->
          <div class="mb3">
            <label class="db f6 fw6 mb2 gray">Enter Bid Amount</label>
            <div class="flex items-center">
              <input
                type="number"
                min="${minBid}"
                max="${maxCoins}"
                value="${this.bidAmount || ''}"
                placeholder="${minBid}"
                oninput=${this.handleBidInput.bind(this)}
                class="input-reset ba b--gray br2 pa2 w-100 f5"
                autofocus
              />
              <span class="f6 gray ml2">/ ${maxCoins} coins</span>
            </div>
            ${minBid > 0 ? this.html`
              <div class="f7 gray mt1">Minimum bid: ${minBid}</div>
            ` : ''}
          </div>

          <!-- Quick Bid Buttons -->
          ${suggestedBids.length > 0 ? this.html`
            <div class="mb3">
              <div class="f7 fw6 mb2 gray">Quick Bids:</div>
              <div class="flex flex-wrap">
                ${suggestedBids.map(amount => this.html`
                  <button
                    onclick=${() => {
                      this.bidAmount = amount;
                      this.validateBid(amount);
                      this.render();
                    }}
                    class="bg-light-blue blue bn br2 pa2 mr2 mb2 pointer hover-bg-blue hover-white f6"
                  >
                    ${amount}
                  </button>
                `)}
              </div>
            </div>
          ` : ''}

          <!-- Error Message -->
          ${error ? this.html`
            <div class="bg-light-red red pa2 br2 mb3 f6">
              ⚠️ ${error}
            </div>
          ` : ''}

          <!-- Action Buttons -->
          <div class="flex gap-2">
            <button
              onclick=${this.handleBid.bind(this)}
              class="bg-green white bn br2 pa3 flex-auto pointer hover-bg-dark-green f5 fw6"
              disabled=${!this.bidAmount || error}
            >
              Place Bid (${this.bidAmount || 0})
            </button>
            <button
              onclick=${this.handlePass.bind(this)}
              class="bg-red white bn br2 pa3 w-30 pointer hover-bg-dark-red f5 fw6"
            >
              Pass
            </button>
          </div>

          <!-- Pass Warning -->
          <div class="f7 gray mt2 i tc">
            Passing means you'll receive the lowest property and pay your current bid (or half if it's the last card)
          </div>
        ` : this.html`
          <!-- Auction Phase - select property to sell -->
          <div class="tc gray f6">
            Select a property card from your hand to auction
          </div>
        `}
      </div>
    `;
  }

  getSuggestedBids(minBid, maxCoins) {
    const suggestions = [];
    const amounts = [minBid, minBid + 2, minBid + 5, Math.floor(maxCoins / 2), maxCoins];

    amounts.forEach(amount => {
      if (amount >= minBid && amount <= maxCoins && !suggestions.includes(amount)) {
        suggestions.push(amount);
      }
    });

    return suggestions.slice(0, 4); // Max 4 suggestions
  }
}

BiddingInterface.define('bidding-interface');
