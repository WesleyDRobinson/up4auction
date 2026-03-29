// Firebase Helper for game state management

const getFirestore = () => {
  if (typeof firebase === 'undefined') {
    console.error('Firebase not initialized');
    return null;
  }
  return firebase.firestore();
};

export const saveGameState = (game) => {
  const db = getFirestore();
  if (!db) return Promise.resolve(null);

  const gameRef = db.collection('games').doc(game.id.toString());
  const gameData = Object.assign({}, game, {
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  return gameRef.set(gameData)
    .then(() => {
      console.log('Game saved to Firestore:', game.id);
      return game.id;
    })
    .catch((error) => {
      console.error('Error saving game:', error);
      return null;
    });
};

export const loadGameState = (gameId) => {
  const db = getFirestore();
  if (!db) return Promise.resolve(null);

  const gameRef = db.collection('games').doc(gameId.toString());
  return gameRef.get()
    .then((doc) => {
      if (doc.exists) {
        console.log('Game loaded from Firestore:', gameId);
        return doc.data();
      } else {
        console.log('Game not found:', gameId);
        return null;
      }
    })
    .catch((error) => {
      console.error('Error loading game:', error);
      return null;
    });
};

export const subscribeToGame = (gameId, callback) => {
  const db = getFirestore();
  if (!db) return () => {};

  const gameRef = db.collection('games').doc(gameId.toString());

  const unsubscribe = gameRef.onSnapshot((doc) => {
    if (doc.exists) {
      console.log('Game updated from Firestore:', gameId);
      callback(doc.data());
    }
  }, (error) => {
    console.error('Error subscribing to game:', error);
  });

  return unsubscribe;
};

export const createGame = (gameData) => {
  const db = getFirestore();
  if (!db) return Promise.resolve(null);

  const gameRef = db.collection('games').doc(gameData.id.toString());
  const data = Object.assign({}, gameData, {
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  return gameRef.set(data)
    .then(() => {
      console.log('New game created in Firestore:', gameData.id);
      return gameData.id;
    })
    .catch((error) => {
      console.error('Error creating game:', error);
      return null;
    });
};

export const listActiveGames = () => {
  const db = getFirestore();
  if (!db) return Promise.resolve([]);

  const gamesRef = db.collection('games');
  return gamesRef
    .where('completed', '==', false)
    .orderBy('createdAt', 'desc')
    .limit(10)
    .get()
    .then((snapshot) => {
      const games = [];
      snapshot.forEach((doc) => {
        const docData = doc.data();
        games.push(Object.assign({id: doc.id}, docData));
      });
      console.log('Found ' + games.length + ' active games');
      return games;
    })
    .catch((error) => {
      console.error('Error listing games:', error);
      return [];
    });
};
