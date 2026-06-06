import { Platform } from 'react-native';

export const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000/api'
    : 'http://localhost:5000/api';

export async function fetchAvailableRooms(canteen = 'All', block = 'All') {
  const params = new URLSearchParams();
  if (canteen && canteen !== 'All') params.append('canteen', canteen);
  if (block && block !== 'All') params.append('block', block);
  const qs = params.toString();
  const url = `${API_BASE_URL}/rooms${qs ? '?' + qs : ''}`;
  const response = await fetch(url);
  const json = await response.json();
  if (!response.ok || !json.success) throw new Error(json.message || 'Failed to fetch rooms.');
  return json.data;
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/rooms/stats`);
  const json = await response.json();
  if (!response.ok || !json.success) throw new Error(json.message || 'Failed to fetch stats.');
  return json.data;
}

export async function claimRoom(roomId, claimedBy) {
  const response = await fetch(`${API_BASE_URL}/rooms/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomId, claimedBy }),
  });
  const json = await response.json();
  if (!response.ok || !json.success) throw new Error(json.message || 'Failed to claim room.');
  return json.data;
}
