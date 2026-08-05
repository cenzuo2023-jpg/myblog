import { craftConfig } from './config';

export async function fetchCraftAPI(endpoint: string) {
  if (!craftConfig.apiUrl) {
    throw new Error('CRAFT_API_URL is not defined in environment variables.');
  }

  const url = `${craftConfig.apiUrl}${endpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Craft API returned ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Craft API Fetch Error [${endpoint}]:`, error);
    throw error;
  }
}

export async function getCollectionItems() {
  if (!craftConfig.collectionId) {
    throw new Error('CRAFT_COLLECTION_ID is not defined in environment variables.');
  }
  const endpoint = `/collections/${craftConfig.collectionId}/items?maxDepth=-1`;
  const data = await fetchCraftAPI(endpoint);
  return data.items || [];
}
