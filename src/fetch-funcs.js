import request from 'superagent';

const URL = 'https://intense-waters-19321.herokuapp.com/'; 

export async function getAllGames() {
  const data = await request.get(`${URL}/games`);

  return data.body;
}

export async function getOneGame(id) {
  const { body } = await request.get(`${URL}/games/${id}`);

  return body;
}

export async function updateGame(id, gameData) {
  const { body } = await request
    .put(`${URL}/games/${id}`)
    .send(gameData);

  return body;
}

export async function createGame(data) {
  const { body } = await request
    .post(`${URL}/games/`)
    .send(data);

  return body;
}

export async function getAllCategories() {
  const { body } = await request.get(`${URL}/categories`);

  return body;
}

export async function deleteGame(id) {
  const { body } = await request.delete(`${URL}/games/${id}`);

  return body;
}