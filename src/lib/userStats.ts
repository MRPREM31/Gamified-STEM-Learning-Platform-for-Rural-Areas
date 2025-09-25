interface UserStats {
  coins: number;
  lastVisit: string;
  streak: number;
}

const USER_STATS_KEY = 'user_stats';

export const getUserStats = (): UserStats => {
  const defaultStats: UserStats = {
    coins: 0,
    lastVisit: new Date().toISOString().split('T')[0],
    streak: 0
  };

  const stats = localStorage.getItem(USER_STATS_KEY);
  if (!stats) {
    return defaultStats;
  }
  return JSON.parse(stats);
};

export const updateUserStats = (newStats: Partial<UserStats>) => {
  const currentStats = getUserStats();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if this is a new day
  if (today !== currentStats.lastVisit) {
    // If they visited yesterday, increment streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (currentStats.lastVisit === yesterdayStr) {
      currentStats.streak += 1;
    } else {
      // Break the streak if they missed a day
      currentStats.streak = 1;
    }
    currentStats.lastVisit = today;
  }

  const updatedStats = {
    ...currentStats,
    ...newStats,
    lastVisit: today
  };

  localStorage.setItem(USER_STATS_KEY, JSON.stringify(updatedStats));
  return updatedStats;
};

export const addCoins = (amount: number) => {
  const stats = getUserStats();
  return updateUserStats({ coins: stats.coins + amount });
};