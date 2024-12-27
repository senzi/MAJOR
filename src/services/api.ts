import OpenAI from 'openai'

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'function';
  content: string;
  name?: string;
}

class APIService {
  private client: OpenAI | null = null
  private apiKey: string = ''

  constructor() {
    // 尝试从 localStorage 获取 API key
    const savedApiKey = localStorage.getItem('moonshot_api_key')
    if (savedApiKey) {
      this.setApiKey(savedApiKey)
    }
  }

  private initClient() {
    if (!this.apiKey) {
      throw new Error('API key not set')
    }

    this.client = new OpenAI({
      apiKey: this.apiKey,
      baseURL: 'https://api.moonshot.cn/v1',
      dangerouslyAllowBrowser: true
    })
  }

  async chat(messages: Message[]): Promise<any> {
    if (!this.client) {
      throw new Error('API client not initialized. Please set API key first.')
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: "moonshot-v1-8k",
        messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
      
      const content = completion.choices[0]?.message?.content
      return content ? JSON.parse(content) : null
    } catch (error) {
      console.error('Chat API error:', error)
      throw error
    }
  }

  setApiKey(key: string) {
    this.apiKey = key
    localStorage.setItem('moonshot_api_key', key)
    this.initClient()
  }

  getApiKey(): string {
    return this.apiKey
  }
}

export const apiService = new APIService();