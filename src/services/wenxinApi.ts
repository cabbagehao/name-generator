import axios from 'axios';
import { Gender } from '../types';

const API_KEY = 'cY1zDSOaDlzARXsFvIvyBmJ9';
const SECRET_KEY = '5weguuNwguTDuXoMg15vwYIgpehaMp54';
const MODEL_NAME = 'ERNIE-4.0-8K';

interface TokenResponse {
  access_token: string;
  expires_in: number;
}

interface WenxinResponse {
  result: string;
}

let accessToken: string | null = null;
let tokenExpiration: number | null = null;

async function getAccessToken(): Promise<string> {
  try {
    if (accessToken && tokenExpiration && Date.now() < tokenExpiration) {
      return accessToken;
    }

    const url = 'https://aip.baidubce.com/oauth/2.0/token';
    const params = {
      grant_type: 'client_credentials',
      client_id: API_KEY,
      client_secret: SECRET_KEY
    };

    const response = await axios.post<TokenResponse>(url, null, { params });
    
    if (response.status === 200 && response.data.access_token) {
      accessToken = response.data.access_token;
      tokenExpiration = Date.now() + (response.data.expires_in * 1000);
      return accessToken;
    }
    
    throw new Error('Invalid token response');
  } catch (error) {
    console.warn('Failed to get access token:', error);
    throw error;
  }
}

export async function generateNamesFromWenxin(
  lastName: string, 
  gender: Gender, 
  count: number = 30
): Promise<string[]> {
  try {
    const token = await getAccessToken();
    const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=${token}`;
    
    const genderText = gender === 'female' ? '女' : '男';
    const prompt = `请生成${count}个小孩的名字，性别${genderText}，姓为${lastName}; 要求：只返回名字列表，用逗号区分，不要返回多余的文字。`;
    
    console.log('Generating names with prompt:', prompt);
    
    const payload = {
      messages: [{ role: 'user', content: prompt }],
      model: MODEL_NAME
    };

    const response = await axios.post<WenxinResponse>(
      url,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.status === 200 && response.data.result) {
      console.log('API response:', response.data.result);
      
      const names = response.data.result
        .split(',')
        .map(name => name.trim())
        .filter(name => name.length > 0);
      
      return names;
    }
    
    return [];
  } catch (error) {
    console.warn('Failed to generate names from API:', error);
    return [];
  }
}