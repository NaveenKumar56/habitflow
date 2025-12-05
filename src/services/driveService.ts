import { Habit } from '../types';

// Types for Global Google Objects
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
const DATA_FILE_NAME = 'habitflow_data.json';

export const initGapiClient = async (apiKey: string, clientId: string) => {
  return new Promise<void>((resolve, reject) => {
    window.gapi.load('client', async () => {
      try {
        await window.gapi.client.init({
          apiKey: apiKey,
          discoveryDocs: [DISCOVERY_DOC],
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
};

export const initTokenClient = (clientId: string, callback: (response: any) => void) => {
  return window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: SCOPES,
    callback: callback,
  });
};

export const findDataFile = async (): Promise<string | null> => {
  try {
    const response = await window.gapi.client.drive.files.list({
      q: `name = '${DATA_FILE_NAME}' and trashed = false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });
    const files = response.result.files;
    if (files && files.length > 0) {
      return files[0].id;
    }
    return null;
  } catch (err) {
    console.error('Error finding file', err);
    throw err;
  }
};

export const createDataFile = async (data: Habit[]): Promise<string> => {
  try {
    const fileContent = JSON.stringify(data);
    const file = new Blob([fileContent], { type: 'application/json' });
    const metadata = {
      name: DATA_FILE_NAME,
      mimeType: 'application/json',
    };

    const accessToken = window.gapi.client.getToken().access_token;
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
      body: form,
    });
    const result = await response.json();
    return result.id;
  } catch (err) {
    console.error('Error creating file', err);
    throw err;
  }
};

export const updateDataFile = async (fileId: string, data: Habit[]) => {
  try {
    const fileContent = JSON.stringify(data);
    const file = new Blob([fileContent], { type: 'application/json' });

    const accessToken = window.gapi.client.getToken().access_token;
    
    // Simple upload for update
    const response = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: new Headers({ 
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      }),
      body: fileContent,
    });
    return await response.json();
  } catch (err) {
    console.error('Error updating file', err);
    throw err;
  }
};

export const loadDataFromFile = async (fileId: string): Promise<Habit[]> => {
  try {
    const response = await window.gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media',
    });
    // GAPI might return result as an object if it's JSON, or a string
    const result = response.result;
    return typeof result === 'string' ? JSON.parse(result) : result;
  } catch (err) {
    console.error('Error loading file content', err);
    throw err;
  }
};
