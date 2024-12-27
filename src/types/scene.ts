export interface Scene {
  id: string
  title: string
  description: string
  introduction: string
  systemPrompt: string
  examples: Example[]
  template: {
    html: string
    css: string
  }
  tags: string[]
}

export interface Example {
  user: string
  assistant: string
}

export interface TemplateData {
  [key: string]: any
}