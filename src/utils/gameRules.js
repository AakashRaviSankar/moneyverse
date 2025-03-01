import {storeData, getData} from './storage';

// Lock the game for 4 hours
export const lockGame = async gameKey => {
  const unlockTime = Date.now() + 4 * 60 * 60 * 1000;
  await storeData(gameKey, unlockTime);
};

// Check if game is locked
export const isGameLocked = async gameKey => {
  const unlockTime = await getData(gameKey);
  return unlockTime && unlockTime > Date.now();
};

// Lock link clicks for 30 seconds
export const lockLinkClick = async () => {
  const unlockTime = Date.now() + 30 * 1000;
  await storeData('linkLock', unlockTime);
};

export const isLinkLocked = async () => {
  const unlockTime = await getData('linkLock');
  return unlockTime && unlockTime > Date.now();
};
