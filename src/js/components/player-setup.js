class PlayerSetup extends HyperHTMLElement {
  created() {
    this.players = [];
    this.render();
  }

  get defaultState() {
    return {
      players: [],
      minPlayers: 3,
      maxPlayers: 6,
      currentInput: ''
    };
  }

  handleInputChange(e) {
    this.setState({ currentInput: e.target.value });
  }

  addPlayer() {
    const { currentInput, players, maxPlayers } = this.state;

    if (!currentInput.trim()) {
      alert('Please enter a player name');
      return;
    }

    if (players.length >= maxPlayers) {
      alert(`Maximum ${maxPlayers} players allowed`);
      return;
    }

    const newPlayers = [...players, currentInput.trim()];
    this.setState({
      players: newPlayers,
      currentInput: ''
    });

    // Clear input field
    const input = this.querySelector('input[type="text"]');
    if (input) input.value = '';

    this.render();
  }

  removePlayer(index) {
    const { players } = this.state;
    const newPlayers = players.filter((_, i) => i !== index);
    this.setState({ players: newPlayers });
    this.render();
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.addPlayer();
    }
  }

  startGame() {
    const { players, minPlayers } = this.state;

    if (players.length < minPlayers) {
      alert(`Need at least ${minPlayers} players to start`);
      return;
    }

    // Dispatch event with player names
    this.dispatchEvent(new CustomEvent('start-game', {
      detail: { playerNames: players },
      bubbles: true
    }));
  }

  render() {
    const { players, minPlayers, maxPlayers } = this.state;
    const canStart = players.length >= minPlayers;
    const canAddMore = players.length < maxPlayers;

    return this.html`
      <div class="player-setup pa4 mw6 center animate__animated animate__fadeIn">
        <!-- Header -->
        <div class="tc mb4 animate__animated animate__bounceInDown">
          <h1 class="f2 fw7 mb2">🏠 For Sale 💰</h1>
          <p class="f5 gray">Set up your game (${minPlayers}-${maxPlayers} players)</p>
        </div>

        <!-- Player List -->
        <div class="player-list bg-white ba b--light-gray br3 pa3 mb3">
          <h3 class="f5 fw6 mb3">Players (${players.length}/${maxPlayers})</h3>

          ${players.length === 0 ? this.html`
            <div class="tc gray i pa3">No players yet. Add players below!</div>
          ` : this.html`
            <div class="players">
              ${players.map((name, index) => this.html`
                <div class="player-item flex items-center justify-between pa2 mb2 bg-light-blue br2">
                  <div class="flex items-center">
                    <span class="f4 mr2">${index === 0 ? '👤' : index === 1 ? '👥' : '👨‍👩‍👧'}</span>
                    <span class="f5 fw6">${name}</span>
                  </div>
                  <button
                    onclick=${() => this.removePlayer(index)}
                    class="bg-red white bn br2 pa2 pointer hover-bg-dark-red f6"
                  >
                    Remove
                  </button>
                </div>
              `)}
            </div>
          `}
        </div>

        <!-- Add Player Form -->
        ${canAddMore ? this.html`
          <div class="add-player bg-white ba b--light-gray br3 pa3 mb3">
            <label class="db f6 fw6 mb2">Add Player</label>
            <div class="flex">
              <input
                type="text"
                placeholder="Enter player name"
                oninput=${this.handleInputChange.bind(this)}
                onkeypress=${this.handleKeyPress.bind(this)}
                class="input-reset ba b--gray br2 pa2 flex-auto mr2"
                autofocus
              />
              <button
                onclick=${this.addPlayer.bind(this)}
                class="bg-blue white bn br2 pa2 pointer hover-bg-dark-blue fw6"
              >
                Add
              </button>
            </div>
          </div>
        ` : this.html`
          <div class="tc gray f6 mb3">Maximum ${maxPlayers} players reached</div>
        `}

        <!-- Start Game Button -->
        <button
          onclick=${this.startGame.bind(this)}
          disabled=${!canStart}
          class="w-100 bg-green white bn br3 pa3 pointer hover-bg-dark-green f4 fw6 ${canStart ? '' : 'o-50'}"
        >
          ${canStart ? 'Start Game!' : `Need ${minPlayers - players.length} more player${minPlayers - players.length > 1 ? 's' : ''}`}
        </button>

        <!-- AI Players -->
        ${canAddMore ? this.html`
          <div class="add-ai bg-light-blue ba b--blue br3 pa3 mb3">
            <h4 class="f6 fw6 mb2">Add AI Opponent</h4>
            <div class="flex gap-2">
              <button
                onclick=${() => {
                  const aiNum = this.state.players.filter(p => p.startsWith('AI')).length + 1;
                  const newPlayers = [...this.state.players, `AI ${aiNum} (Easy)`];
                  this.setState({ players: newPlayers });
                  this.render();
                }}
                class="bg-green white bn br2 pa2 pointer hover-bg-dark-green f6 flex-auto"
              >
                + Easy AI
              </button>
              <button
                onclick=${() => {
                  const aiNum = this.state.players.filter(p => p.startsWith('AI')).length + 1;
                  const newPlayers = [...this.state.players, `AI ${aiNum} (Medium)`];
                  this.setState({ players: newPlayers });
                  this.render();
                }}
                class="bg-gold white bn br2 pa2 pointer hover-bg-dark-red f6 flex-auto"
              >
                + Medium AI
              </button>
              <button
                onclick=${() => {
                  const aiNum = this.state.players.filter(p => p.startsWith('AI')).length + 1;
                  const newPlayers = [...this.state.players, `AI ${aiNum} (Hard)`];
                  this.setState({ players: newPlayers });
                  this.render();
                }}
                class="bg-red white bn br2 pa2 pointer hover-bg-dark-red f6 flex-auto"
              >
                + Hard AI
              </button>
            </div>
          </div>
        ` : ''}

        <!-- Quick Setup Options -->
        <div class="tc mt3">
          <button
            onclick=${() => {
              this.setState({
                players: ['You', 'AI 1 (Medium)', 'AI 2 (Medium)']
              });
              this.render();
            }}
            class="bg-light-gray bn br2 pa2 pointer hover-bg-gray f6 mr2 mb2"
          >
            🎮 Play vs AI (3 Players)
          </button>
          <button
            onclick=${() => {
              this.setState({
                players: ['Alice', 'Bob', 'Charlie']
              });
              this.render();
            }}
            class="bg-light-gray bn br2 pa2 pointer hover-bg-gray f6 mr2 mb2"
          >
            👥 Local 3-Player
          </button>
          <button
            onclick=${() => {
              this.setState({
                players: ['Alice', 'Bob', 'Charlie', 'Diana']
              });
              this.render();
            }}
            class="bg-light-gray bn br2 pa2 pointer hover-bg-gray f6"
          >
            👥 Local 4-Player
          </button>
        </div>
      </div>
    `;
  }
}

PlayerSetup.define('player-setup');
