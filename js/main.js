import axiosClient from './api/axiosClient.js';
import postApi from './api/postApi.js';

async function main() {
  try {
    const query = {
      _page: 1,
      _limit: 5,
    };
    const data = await postApi.getAll(query);
    console.log('main.js data: ', data);
  } catch (error) {
    console.log('Get all fail', error);
  }
}

main();
