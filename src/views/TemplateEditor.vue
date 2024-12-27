<template>
  <div class="editor-container">
    <div class="editor-header">
      <button @click="router.push('/')" class="back-button">← 返回</button>
      <h2>{{ isEditing ? '编辑模板' : '创建模板' }}</h2>
      <div class="header-actions">
        <button @click="exportTemplate" class="export-button">导出</button>
        <button @click="saveTemplate" class="save-button" :disabled="!isValid">保存</button>
      </div>
    </div>

    <div class="editor-content">
      <div class="form-section">
        <div class="ai-generator">
          <div class="input-group">
            <input 
              v-model="aiInput" 
              type="text" 
              placeholder="描述你想要的工具，例如：'创建一个将文本转换为思维导图的工具'" 
              :disabled="generating"
            />
            <button 
              @click="generateTemplate" 
              :disabled="!aiInput.trim() || generating"
              class="generate-button"
            >
              <span v-if="generating">生成中...</span>
              <span v-else>生成模板</span>
            </button>
          </div>
          <div class="ai-warning">
            <p class="warning-text">⚠️ 注意事项：</p>
            <ul>
              <li>使用 AI 生成器会消耗大量 Token，生成过程可能需要较长时间</li>
              <li>当前 Prompt 质量有限，生成的模板可能较为简单，样式可能不够丰富</li>
              <li>建议开发者自行编写模板或使用其他方式完善模板内容</li>
            </ul>
          </div>
        </div>

        <div class="form-group">
          <label>标题 *</label>
          <input v-model="template.title" placeholder="输入模板标题" @input="validate" />
          <span v-if="errors.title" class="error">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label>描述 *</label>
          <input v-model="template.description" placeholder="简要描述" @input="validate" />
          <span v-if="errors.description" class="error">{{ errors.description }}</span>
        </div>

        <div class="form-group">
          <label>介绍 *</label>
          <textarea v-model="template.introduction" placeholder="详细介绍" rows="4" @input="validate"></textarea>
          <span v-if="errors.introduction" class="error">{{ errors.introduction }}</span>
        </div>

        <div class="form-group">
          <label>系统提示 *</label>
          <textarea v-model="template.systemPrompt" placeholder="系统提示" rows="4" @input="validate"></textarea>
          <span v-if="errors.systemPrompt" class="error">{{ errors.systemPrompt }}</span>
        </div>

        <div class="form-group">
          <label>标签</label>
          <div class="tags-input">
            <input 
              v-model="newTag"
              @keydown.enter.prevent="addTag"
              placeholder="按 Enter 添加标签"
            />
            <div class="tags-list">
              <span v-for="tag in template.tags" :key="tag" class="tag">
                {{ tag }}
                <button @click="removeTag(tag)" class="remove-tag">×</button>
              </span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>示例</label>
          <div v-for="(example, index) in template.examples" :key="index" class="example-item">
            <div class="example-header">
              <span>示例 {{ index + 1 }}</span>
              <button @click="removeExample(index)" class="remove-example">删除</button>
            </div>
            <input v-model="example.user" placeholder="用户消息" />
            <textarea v-model="example.assistant" placeholder="助手响应" rows="3"></textarea>
          </div>
          <button @click="addExample" class="add-example">添加示例</button>
        </div>

        <div class="form-group">
          <label>模板 HTML *</label>
          <textarea v-model="template.template.html" placeholder="HTML 模板代码" rows="6" @input="validate"></textarea>
          <span v-if="errors.html" class="error">{{ errors.html }}</span>
        </div>

        <div class="form-group">
          <label>模板 CSS *</label>
          <textarea v-model="template.template.css" placeholder="CSS 样式" rows="6" @input="validate"></textarea>
          <span v-if="errors.css" class="error">{{ errors.css }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Scene } from '@/types/scene'
import { apiService } from '@/services/api'

const router = useRouter()
const route = useRoute()

const isEditing = computed(() => route.params.id !== 'new')

// Template state
const template = reactive<Scene>({
  id: isEditing.value ? String(route.params.id) : `custom_${Date.now()}`,
  title: '',
  description: '',
  introduction: '',
  systemPrompt: '',
  tags: [],
  examples: [],
  template: {
    html: '',
    css: ''
  }
})

// Form state
const newTag = ref('')
const errors = reactive({
  title: '',
  description: '',
  introduction: '',
  systemPrompt: '',
  html: '',
  css: ''
})

const aiInput = ref('')
const generating = ref(false)

const systemPrompt = `你是一个专业的模板生成器。请根据用户的描述，生成一个完整的工具模板配置。

你必须始终以JSON格式回复，包含以下字段：
- title: 工具标题（简短描述）
- description: 工具描述（一句话概述功能）
- introduction: 详细介绍（包含使用说明）
- systemPrompt: 系统提示词（用于指导AI生成符合要求的JSON输出，务必包含JSON字段描述以及数据类型描述，必须包含一个完整的JSON示例。）
- examples: 示例列表（每个示例包含user(自然语言需求)和assistant字段(Json对象)）
- template: 模板配置（包含html和css字段，使用Handlebars作为模板引擎）

示例格式：
{
  "title": "角色生成器",
  "description": "生成详细的角色设定",
  "introduction": "欢迎使用角色生成器！\n这是一个强大的工具，可以帮助你创建丰富多彩的角色设定。\n你可以描述你想要的角色类型，我会为你生成完整的角色设定。",
  "systemPrompt": "你是一个专业的角色设定生成器。请根据用户的描述，生成一个完整的角色设定。\n\n你必须始终以JSON格式回复，包含以下字段：\n- name: 角色名字\n- level: 等级（数字）\n- class: 职业\n- skills: 技能列表（数组）\n- description: 角色描述\n\n示例格式：\n{\n  \"name\": \"星辰法师\",\n  \"level\": 5,\n  \"class\": \"法师\",\n  \"skills\": [\"星光术\", \"空间跳跃\"],\n  \"description\": \"来自遥远星空的神秘法师\"\n}",
  "examples": [
    {
      "user": "生成一个魔法师角色",
      "assistant": "{\"name\":\"星辰法师\",\"level\":5,\"class\":\"法师\",\"skills\":[\"星光术\",\"空间跳跃\"],\"description\":\"来自遥远星空的神秘法师\"}"
    }
  ],
  "template": {
    "html": "<div class=\"character-card\">\n  <h3>{{name}}</h3>\n  <div class=\"character-info\">\n    <p><strong>等级:</strong> {{level}}</p>\n    <p><strong>职业:</strong> {{class}}</p>\n  </div>\n  <div class=\"character-skills\">\n    <h4>技能</h4>\n    <ul>\n      {{#each skills}}\n        <li>{{this}}</li>\n      {{/each}}\n    </ul>\n  </div>\n  <div class=\"character-desc\">\n    {{description}}\n  </div>\n</div>",
    "css": ".character-card {\n  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);\n  border-radius: 16px;\n  padding: 24px;\n  color: #fff;\n  max-width: 400px;\n  margin: 20px auto;\n}\n\n.character-card h3 {\n  color: #60a5fa;\n  font-size: 28px;\n  margin: 0 0 20px 0;\n  text-align: center;\n}\n\n.character-info {\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 12px;\n  padding: 16px;\n  margin-bottom: 20px;\n}\n\n.character-skills ul {\n  list-style: none;\n  padding: 0;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\n.character-skills li {\n  background: rgba(96, 165, 250, 0.15);\n  padding: 6px 14px;\n  border-radius: 20px;\n  color: #93c5fd;\n}"
  }
}`

const generateTemplate = async () => {
  if (!aiInput.value.trim() || generating.value) return

  generating.value = true
  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: aiInput.value }
    ]

    const response = await apiService.chat(messages)
    if (response) {
      // 处理示例数组
      const examples = response.examples?.map(example => {
        // 如果 assistant 是数组，处理每个元素
        if (Array.isArray(example.assistant)) {
          return {
            user: example.user,
            assistant: example.assistant.map(item => 
              typeof item === 'string' ? item : JSON.stringify(item)
            ).join('\n')
          }
        }
        // 如果 assistant 是单个值
        return {
          user: example.user,
          assistant: typeof example.assistant === 'string' 
            ? example.assistant 
            : JSON.stringify(example.assistant)
        }
      }) || []

      // 更新模板数据
      template.title = response.title || ''
      template.description = response.description || ''
      template.introduction = response.introduction || ''
      template.systemPrompt = response.systemPrompt || ''
      template.examples = examples
      template.template = response.template || { html: '', css: '' }
      
      // 清空输入
      aiInput.value = ''
    }
  } catch (error) {
    console.error('生成模板失败:', error)
    alert('生成模板失败，请确保已设置正确的 API Key')
  } finally {
    generating.value = false
  }
}

// Validation
const validate = () => {
  errors.title = !template.title?.trim() ? '标题是必填项' : ''
  errors.description = !template.description?.trim() ? '描述是必填项' : ''
  errors.introduction = !template.introduction?.trim() ? '介绍是必填项' : ''
  errors.systemPrompt = !template.systemPrompt?.trim() ? '系统提示是必填项' : ''
  errors.html = !template.template?.html?.trim() ? 'HTML 模板是必填项' : ''
  errors.css = !template.template?.css?.trim() ? 'CSS 样式是必填项' : ''
}

const isValid = computed(() => {
  return template.title?.trim() &&
    template.description?.trim() &&
    template.introduction?.trim() &&
    template.systemPrompt?.trim() &&
    template.template?.html?.trim() &&
    template.template?.css?.trim()
})

// Tags management
const addTag = () => {
  const tag = newTag.value.trim()
  if (tag && !template.tags.includes(tag)) {
    template.tags.push(tag)
  }
  newTag.value = ''
}

const removeTag = (tag: string) => {
  const index = template.tags.indexOf(tag)
  if (index > -1) {
    template.tags.splice(index, 1)
  }
}

// Examples management
const addExample = () => {
  template.examples.push({
    user: '',
    assistant: ''
  })
}

const removeExample = (index: number) => {
  template.examples.splice(index, 1)
}

// Save and export
const saveTemplate = () => {
  // Get existing templates from localStorage
  const savedTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]')
  
  // Update or add the template
  const existingIndex = savedTemplates.findIndex((t: Scene) => t.id === template.id)
  if (existingIndex > -1) {
    savedTemplates[existingIndex] = template
  } else {
    savedTemplates.push(template)
  }
  
  // Save back to localStorage
  localStorage.setItem('customTemplates', JSON.stringify(savedTemplates))
  
  // Navigate back to home
  router.push('/')
}

const exportTemplate = () => {
  const dataStr = JSON.stringify(template, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `template_${template.id}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 加载已有模板
onMounted(() => {
  if (isEditing.value) {
    const customTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]')
    const existingTemplate = customTemplates.find((t: Scene) => t.id === route.params.id)
    if (existingTemplate) {
      Object.assign(template, existingTemplate)
    }
  }
})
</script>

<style scoped>
.editor-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
}

.editor-header {
  display: flex;
  align-items: center;
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border);
  background-color: var(--surface);
  position: sticky;
  top: 0;
  z-index: 10;
}

.editor-header h2 {
  margin: 0;
  flex: 1;
  text-align: center;
  color: var(--text-primary);
}

.back-button {
  padding: var(--spacing-2) var(--spacing-4);
  border: none;
  background: none;
  color: var(--primary);
  cursor: pointer;
  font-size: var(--font-size-base);
}

.header-actions {
  display: flex;
  gap: var(--spacing-2);
  margin-left: auto;
}

.export-button,
.save-button {
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background-color: var(--background);
  cursor: pointer;
  transition: var(--transition);
  min-width: 80px;
  font-size: var(--font-size-sm);
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.export-button:hover {
  background-color: var(--surface);
  border-color: var(--primary);
}

.save-button {
  background-color: var(--primary);
  color: var(--surface);
  border: none;
}

.save-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
}

.form-section {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: var(--spacing-4);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-2);
  color: var(--text-primary);
  font-weight: 500;
}

input,
textarea {
  width: 100%;
  padding: var(--spacing-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background-color: var(--surface);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
}

textarea {
  resize: vertical;
}

.error {
  color: var(--error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-1);
}

.tags-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2);
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  padding: 2px var(--spacing-2);
  background-color: var(--background-soft);
  border-radius: var(--radius);
  font-size: var(--font-size-sm);
}

.remove-tag {
  border: none;
  background: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 0 var(--spacing-1);
}

.example-item {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-3);
  margin-bottom: var(--spacing-3);
}

.example-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-2);
}

.example-item input,
.example-item textarea {
  margin-bottom: var(--spacing-2);
}

.add-example {
  width: 100%;
  padding: var(--spacing-2);
  background-color: var(--background-soft);
  border: 1px dashed var(--border);
  border-radius: var(--radius);
  color: var(--text-primary);
  cursor: pointer;
}

.remove-example {
  padding: var(--spacing-1) var(--spacing-2);
  background-color: var(--background-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text-light);
  cursor: pointer;
}

.ai-generator {
  margin-bottom: var(--spacing-6);
  padding: var(--spacing-4);
  background: linear-gradient(135deg, var(--surface), var(--background));
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.ai-input {
  display: flex;
  gap: var(--spacing-2);
}

.ai-input input {
  flex: 1;
}

.generate-button {
  padding: var(--spacing-2) var(--spacing-4);
  background-color: var(--primary);
  color: var(--surface);
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  min-width: 100px;
}

.generate-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.generate-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-warning {
  margin-top: 16px;
  padding: 12px 16px;
  background-color: #fff8e6;
  border: 1px solid #ffd591;
  border-radius: 6px;
}

.warning-text {
  color: #d48806;
  font-weight: 500;
  margin: 0 0 8px 0;
}

.ai-warning ul {
  margin: 0;
  padding-left: 20px;
  color: #666;
}

.ai-warning li {
  margin: 4px 0;
  line-height: 1.5;
}
</style>
