import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';

const TimerLock = ({unlockTime}) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = unlockTime - now;
      setTimeLeft(diff > 0 ? Math.floor(diff / 1000) : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [unlockTime]);

  return <Text>Unlock in: {timeLeft > 0 ? `${timeLeft}s` : 'Ready'}</Text>;
};

export default TimerLock;
