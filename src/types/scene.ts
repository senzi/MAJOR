export interface Scene {
  id: string
  title: string
  description: string
  introduction: string
  systemPrompt: string
  examples: Example[]
  template: string
  templateData?: (data: TemplateData) => string
  tags: string[]
}

export interface Example {
  user: string
  assistant: string
}

export interface TemplateData {
  skills: string[]
  description: string
}