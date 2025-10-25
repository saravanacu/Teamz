import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:4000/api' });

export async function fetchClubs(params = {}) {
  const res = await API.get('/clubs', { params });
  return res.data.data;
}

export async function fetchClubById(id) {
  const res = await API.get(`/clubs/${id}`);
  return res.data.data;
}

export async function addClub(payload) {
  const res = await API.post('/clubs', payload);
  return res.data.data;
}