// AI Player strategies for For Sale game

/**
 * Conservative AI - Bids cautiously, passes more often
 */
const conservativeStrategy = (game, player) => {
  const { round, players } = game;
  const { cards, bid: currentBid } = round;

  // Calculate average card value
  const avgCardValue = cards.reduce((sum, card) => sum + card.value, 0) / cards.length;

  // Conservative AI only bids on higher-value cards
  if (avgCardValue < 15) {
    // Low value cards - likely to pass
    if (player.bid === 0) {
      // Make a small initial bid
      return { action: 'bid', amount: 1 };
    }
    // Pass if others are bidding
    return { action: 'pass' };
  }

  // For higher value cards, bid conservatively
  const maxBid = Math.floor(player.coins * 0.3); // Only use 30% of coins
  const newBid = Math.min(currentBid + 1, maxBid);

  if (newBid <= player.coins && newBid > currentBid) {
    return { action: 'bid', amount: newBid };
  }

  return { action: 'pass' };
};

/**
 * Aggressive AI - Bids high, wants to win
 */
const aggressiveStrategy = (game, player) => {
  const { round } = game;
  const { cards, bid: currentBid } = round;

  // Calculate max card value
  const maxCardValue = Math.max(...cards.map(card => card.value));

  // Aggressive AI bids more on high-value cards
  if (maxCardValue > 20) {
    // High value card - bid aggressively
    const maxBid = Math.floor(player.coins * 0.6); // Use up to 60% of coins
    const newBid = Math.min(currentBid + 2, maxBid);

    if (newBid <= player.coins && newBid > currentBid) {
      return { action: 'bid', amount: newBid };
    }
  }

  // For medium cards, bid moderately
  const moderateBid = Math.min(currentBid + 1, Math.floor(player.coins * 0.4));
  if (moderateBid <= player.coins && moderateBid > currentBid) {
    return { action: 'bid', amount: moderateBid };
  }

  return { action: 'pass' };
};

/**
 * Balanced AI - Mix of conservative and aggressive
 */
const balancedStrategy = (game, player) => {
  const { round } = game;
  const { cards, bid: currentBid } = round;

  // Calculate average card value
  const avgCardValue = cards.reduce((sum, card) => sum + card.value, 0) / cards.length;
  const coinsRemaining = player.coins;

  // Decide based on card value and coins remaining
  if (avgCardValue > 18 && coinsRemaining > 10) {
    // Good cards and plenty of coins - bid
    const newBid = Math.min(currentBid + 2, Math.floor(coinsRemaining * 0.4));
    if (newBid <= coinsRemaining && newBid > currentBid) {
      return { action: 'bid', amount: newBid };
    }
  } else if (avgCardValue > 10 && coinsRemaining > 5) {
    // Medium cards - bid conservatively
    const newBid = currentBid + 1;
    if (newBid <= coinsRemaining && newBid > currentBid) {
      return { action: 'bid', amount: newBid };
    }
  }

  // Default to pass
  return { action: 'pass' };
};

/**
 * Random AI - Makes random decisions
 */
const randomStrategy = (game, player) => {
  const { round } = game;
  const { bid: currentBid } = round;

  // 50% chance to bid or pass
  if (Math.random() < 0.5 && player.coins > 0) {
    // Random bid between current+1 and current+5
    const randomIncrease = Math.floor(Math.random() * 5) + 1;
    const newBid = Math.min(currentBid + randomIncrease, player.coins);

    if (newBid > currentBid) {
      return { action: 'bid', amount: newBid };
    }
  }

  return { action: 'pass' };
};

/**
 * Get AI strategy by difficulty level
 */
export const getAIStrategy = (difficulty = 'balanced') => {
  const strategies = {
    easy: conservativeStrategy,
    medium: balancedStrategy,
    hard: aggressiveStrategy,
    random: randomStrategy
  };

  return strategies[difficulty] || balancedStrategy;
};

/**
 * AI selects which property to auction
 */
const selectPropertyForAuction = (game, player, difficulty) => {
  const { propertyCards } = player;

  if (!propertyCards || propertyCards.length === 0) {
    return null;
  }

  // Different strategies for selecting properties
  if (difficulty === 'easy') {
    // Easy AI: randomly picks a property
    const randomIndex = Math.floor(Math.random() * propertyCards.length);
    return propertyCards[randomIndex];
  } else if (difficulty === 'hard') {
    // Hard AI: sells lowest value properties first to keep good ones
    const sortedProps = propertyCards.slice().sort((a, b) => a.value - b.value);
    return sortedProps[0];
  } else {
    // Medium AI: balanced approach - sells middle-value properties
    const sortedProps = propertyCards.slice().sort((a, b) => a.value - b.value);
    const middleIndex = Math.floor(sortedProps.length / 2);
    return sortedProps[middleIndex];
  }
};

/**
 * Execute AI turn (works for both bidding and auction phases)
 */
export const executeAITurn = (game, player, strategy = 'balanced') => {
  if (game.phase === 'auctioning') {
    // In auction phase, select a property to sell
    const selectedProperty = selectPropertyForAuction(game, player, strategy);
    if (selectedProperty) {
      console.log(`AI ${player.name} (${strategy}) selling property:`, selectedProperty.value);
      return { action: 'auction', card: selectedProperty };
    }
    return { action: 'skip' };
  } else {
    // In bidding phase, use normal strategy
    const aiStrategy = getAIStrategy(strategy);
    const decision = aiStrategy(game, player);
    console.log(`AI ${player.name} (${strategy}) decided to:`, decision);
    return decision;
  }
};

/**
 * Check if player is AI
 */
export const isAIPlayer = (player) => {
  return player.name.startsWith('AI') || player.isAI === true;
};

/**
 * Get AI difficulty from player name
 */
export const getAIDifficulty = (player) => {
  if (player.difficulty) return player.difficulty;

  // Extract from name like "AI (Easy)"
  const match = player.name.match(/AI.*\((.*?)\)/);
  if (match) {
    return match[1].toLowerCase();
  }

  return 'medium';
};
