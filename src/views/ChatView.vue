<template>
  <div class="chat-container">
    <!-- 顶部导航 -->
    <div class="chat-header">
      <button @click="router.push('/')" class="back-button">
        ← Back
      </button>
      <h2>{{ currentScene?.title }}</h2>
    </div>

    <div class="chat-layout">
      <!-- 左侧聊天区域 -->
      <div class="chat-section">
        <!-- 场景介绍区域 -->
        <div class="scene-introduction">
          <div class="introduction-content">
            <pre>{{ currentScene?.introduction }}</pre>
          </div>
          <div class="example-section">
            <h4>示例：</h4>
            <div v-for="(example, index) in currentScene?.examples" :key="index" class="example-item">
              <div class="example-user">👤 {{ example.user }}</div>
              <div class="example-assistant">🤖 {{ example.assistant }}</div>
            </div>
          </div>
          <div class="divider"></div>
        </div>
        <!-- 聊天历史 -->
        <div class="chat-history" ref="chatHistoryRef">
          <div v-for="(msg, index) in chatHistory" :key="index" :class="['message', msg.role]">
            <div class="message-content">{{ msg.content }}</div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input">
          <textarea v-model="newMessage" @keydown.enter.prevent="sendMessage" placeholder="输入消息..." rows="3"
            :disabled="loading"></textarea>
          <button @click="sendMessage" :disabled="!newMessage.trim() || loading">
            {{ loading ? '发送中...' : '发送' }}
          </button>
        </div>
      </div>

      <!-- 右侧JSON和渲染预览 -->
      <div class="preview-section">
        <div class="tabs">
          <button :class="{ active: activeTab === 'json' }" @click="activeTab = 'json'">
            JSON
          </button>
          <button :class="{ active: activeTab === 'prompt' }" @click="activeTab = 'prompt'">
            Prompt
          </button>
          <button :class="{ active: activeTab === 'preview' }" @click="activeTab = 'preview'">
            预览
          </button>
          <button :class="{ active: activeTab === 'template' }" @click="activeTab = 'template'">
            模板
          </button>
        </div>

        <div class="tab-content">
          <!-- JSON 展示 -->
          <div v-if="activeTab === 'json'" class="json-view">
            <pre>{{ currentJson }}</pre>
          </div>

          <!-- Prompt 展示 -->
          <div v-if="activeTab === 'prompt'" class="prompt-view">
            <pre>{{ currentScene?.systemPrompt }}</pre>
          </div>

          <!-- 预览展示 -->
          <div v-if="activeTab === 'preview'" class="preview-view">
            <div v-html="renderedContent"></div>
          </div>

          <!-- 模板展示 -->
          <div v-if="activeTab === 'template'" class="template-view">
            <div class="template-section">
              <h4>HTML 模板</h4>
              <pre>{{ templateContent.html }}</pre>
            </div>
            <div class="template-section">
              <h4>CSS 样式</h4>
              <pre>{{ templateContent.css }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import { getSceneById } from '@/data/scenes'
import { apiService } from '@/services/api'
import type { Scene } from '@/types/scene'
import { renderTemplate, getTemplateContent } from '@/services/template'

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()

const currentScene = ref<Scene | null>(null)
const chatHistory = ref<Array<{role: string, content: string}>>([])
const newMessage = ref('')
const chatHistoryRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const activeTab = ref<'json' | 'prompt' | 'preview' | 'template'>('preview')
const currentJson = ref('{}')

onMounted(() => {
  const sceneId = route.params.sceneId as string
  const scene = getSceneById(sceneId)
  if (!scene) {
    router.push('/')
    return
  }
  currentScene.value = scene
})

const templateContent = computed(() => {
  if (!currentScene.value) return { html: '', css: '' }
  return getTemplateContent(currentScene.value.template)
})

const renderedContent = computed(() => {
  try {
    const json = JSON.parse(currentJson.value)
    if (currentScene.value?.template) {
      return renderTemplate(currentScene.value.template, json)
    }
    return currentJson.value
  } catch (error) {
    console.error('Error rendering template:', error)
    return '渲染错误'
  }
})

const sendMessage = async () => {
  if (!newMessage.value.trim() || loading.value) return

  // 添加用户消息
  chatHistory.value.push({
    role: 'user' as const,
    content: newMessage.value
  })

  const inputContent = newMessage.value
  newMessage.value = ''
  loading.value = true

  try {
    // 构建消息历史
    const messages = [
      {
        role: "system",
        content: "你是一个专业的助手，请始终以JSON格式回复，包含所有必要的信息。确保回复的JSON是有效的，并包含所有必需的字段。"
      },
      {
        role: "system",
        content: currentScene.value?.systemPrompt || ''
      },
      ...chatHistory.value.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ]

    // 调用API
    const response = await apiService.chat(messages)

    // 添加助手响应
    chatHistory.value.push({
      role: 'assistant' as const,
      content: JSON.stringify(response)
    })

    // 更新当前JSON
    currentJson.value = JSON.stringify(response, null, 2)
  } catch (error) {
    console.error('Chat error:', error)
    chatHistory.value.push({
      role: 'assistant' as const,
      content: JSON.stringify({
        text: '抱歉，发生了错误，请稍后重试。',
        error: error instanceof Error ? error.message : String(error)
      })
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (chatHistoryRef.value) {
      chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
    }
  }, 100)
}

watch(chatHistory, scrollToBottom)
</script>

<style scoped>
.chat-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
}

.chat-header {
  padding: var(--spacing-4);
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  flex-shrink: 0;
}

.chat-header h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--text-primary);
}

.back-button {
  padding: var(--spacing-2) var(--spacing-4);
  border: none;
  background: var(--primary);
  color: white;
  border-radius: var(--radius);
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: var(--transition);
}

.back-button:hover {
  background: var(--primary-dark);
}

.chat-layout {
  flex: 1;
  display: flex;
  min-height: 0;
}

.chat-section {
  width: 40%;
  display: flex;
  flex-direction: column;
  min-width: 0;
  border-right: 1px solid var(--border);
}

.scene-introduction {
  padding: var(--spacing-4);
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.introduction-content {
  color: var(--text-secondary);
  white-space: pre-wrap;
  margin-bottom: var(--spacing-4);
}

.example-section h4 {
  color: var(--text-primary);
  margin: 0 0 var(--spacing-2) 0;
  font-size: var(--font-size-md);
}

.example-item {
  background-color: var(--background);
  border-radius: var(--radius);
  padding: var(--spacing-3);
  margin-bottom: var(--spacing-2);
}

.example-item:last-child {
  margin-bottom: 0;
}

.example-user {
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.example-assistant {
  color: var(--text-secondary);
  font-family: monospace;
}

.divider {
  height: 1px;
  background-color: var(--border);
  margin: var(--spacing-4) 0;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.message {
  padding: var(--spacing-3);
  border-radius: var(--radius);
  max-width: 80%;
}

.message.user {
  background-color: var(--primary);
  color: white;
  align-self: flex-end;
}

.message.assistant {
  background-color: var(--surface);
  color: var(--text-primary);
  align-self: flex-start;
  font-family: monospace;
  border: 1px solid var(--border);
}

.chat-input {
  padding: var(--spacing-4);
  background-color: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  gap: var(--spacing-2);
  flex-shrink: 0;
}

.chat-input textarea {
  flex: 1;
  padding: var(--spacing-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background-color: var(--background);
  color: var(--text-primary);
  resize: none;
  font-family: inherit;
  line-height: 1.5;
  height: 60px;
}

.chat-input textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.chat-input button {
  padding: var(--spacing-2) var(--spacing-4);
  border: none;
  background-color: var(--primary);
  color: white;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.chat-input button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.chat-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 400px;
}

.tabs {
  display: flex;
  gap: var(--spacing-1);
  padding: var(--spacing-2);
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
}

.tabs button {
  padding: var(--spacing-2) var(--spacing-4);
  border: none;
  background: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: var(--radius);
  transition: var(--transition);
}

.tabs button:hover {
  background-color: var(--background);
}

.tabs button.active {
  background-color: var(--primary);
  color: white;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
  display: flex;
  flex-direction: column;
}

.json-view pre,
.prompt-view pre {
  margin: 0;
  padding: var(--spacing-4);
  background-color: var(--surface);
  border-radius: var(--radius);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--text-primary);
  font-family: monospace;
  line-height: 1.5;
  flex: 1;
  border: 1px solid var(--border);
}

.preview-view {
  height: 100%;
  overflow-y: auto;
  background-color: white;
  border-radius: var(--radius);
  padding: var(--spacing-4);
  flex: 1;
  border: 1px solid var(--border);
}

.template-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  flex: 1;
}

.template-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.template-section h4 {
  margin: 0 0 var(--spacing-2) 0;
  color: var(--text-primary);
}

.template-section pre {
  flex: 1;
  margin: 0;
  padding: var(--spacing-4);
  background-color: var(--surface);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--text-primary);
  font-family: monospace;
  line-height: 1.5;
}
</style>