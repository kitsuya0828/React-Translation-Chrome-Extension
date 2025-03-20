const API_URL = 'https://api-free.deepl.com/v2/translate';
const API_KEY = process.env.CEB_DEEPL_API_KEY || '';
// const API_URL = 'https://script.google.com/macros/s/AKfycbwaZkRiYyf84rK_FyPYtAfLVUfJaNP51QnXzKAxz0lFaTv9JVSUUpjVJK59X247el-m/exec';
// const API_URL = 'https://translation-app.kitsuyaazuma.workers.dev/translate';

export async function translate(text: string, targetLang: string): Promise<string> {
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `DeepL-Auth-Key ${API_KEY}`, // DeepL API を使用する場合のみ
  };
  let requestBody: any = { text: [text], target_lang: targetLang };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
      mode: 'cors',
    });
    if (!response.ok) {
      throw new Error(`Translation API request failed with status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.translations || !Array.isArray(data.translations) || data.translations.length === 0) {
      throw new Error('Invalid response from Translation API');
    }

    return data.translations[0].text;
  } catch (error) {
    console.error('Translation Error:', error);
    return '';
  }
}
