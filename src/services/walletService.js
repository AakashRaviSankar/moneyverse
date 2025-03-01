import axios from 'axios';
import config from '../config';
import {getUserData} from '../utils/helper';

const fetchBalanceService = async () => {
  const userData = await getUserData();
  try {
    const response = await axios.get(
      `${config.Base}/wallets/user/${userData?.userId}`,
      {
        headers: {
          Authorization: `Bearer ${userData?.accessToken}`,
        },
      },
    );

    const data = response.data;

    return data;
  } catch (error) {
    console.error(
      'Balance Fetch Error:',
      error?.response?.data || error.message,
    );
  }
};

export {fetchBalanceService};
