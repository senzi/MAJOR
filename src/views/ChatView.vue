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
        <!-- 聊天输入区域 -->
        <div class="chat-input">
          <textarea v-model="userInput" @keydown.enter.prevent="sendMessage" placeholder="输入消息..." rows="3"
            :disabled="isLoading"></textarea>
          <button @click="sendMessage" :disabled="!userInput.trim() || isLoading">
            {{ isLoading ? '发送中...' : '发送' }}
          </button>
        </div>
      </div>

      <!-- 右侧JSON和渲染预览 -->
      <div class="preview-section">
        <div class="tabs">
          <button :class="{ active: activeTab === 'json' }" @click="activeTab = 'json'">
            JSON
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

          <!-- 预览展示 -->
          <div v-if="activeTab === 'preview'" class="preview-view">
            <div v-html="renderedContent"></div>
          </div>

          <!-- 模板展示 -->
          <div v-if="activeTab === 'template'" class="template-view">
            <pre>{{ currentScene?.template }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSceneById } from '@/data/scenes'
import { apiService } from '@/services/api'
import type { Scene } from '@/types/scene'
import type { Message } from '@/services/api'

const route = useRoute()
const router = useRouter()

// 状态管理
const userInput = ref('')
const activeTab = ref<'json' | 'preview' | 'template'>('preview')
const chatHistoryRef = ref<HTMLElement | null>(null)
const currentJson = ref('{}') // 最新的JSON响应
const chatHistory = ref<Array<Message>>([])
const isLoading = ref(false)

// 获取当前场景
const currentScene = computed(() =>
  getSceneById(route.params.sceneId as string)
)

// 计算渲染结果
const renderedContent = computed(() => {
  try {
    const jsonData = JSON.parse(currentJson.value)
    let template = currentScene.value?.template || ''

    // 处理技能列表
    const skillsList = jsonData.skills?.map((skill: string) => `<li>${skill}</li>`).join('') || ''
    template = template.replace('{{skills_list}}', skillsList)

    // 处理其他字段
    Object.entries(jsonData).forEach(([key, value]) => {
      if (key !== 'skills') {  // 跳过已处理的技能列表
        template = template.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
      }
    })
    return template
  } catch (e) {
    console.error('Rendering error:', e)
    return '渲染错误'
  }
})

// 发送消息
const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  // 添加用户消息
  chatHistory.value.push({
    role: 'user' as const,
    content: userInput.value
  })

  const inputContent = userInput.value
  userInput.value = ''
  isLoading.value = true

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
    isLoading.value = false
    scrollToBottom()
  }
}

// 自动滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    if (chatHistoryRef.value) {
      chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
    }
  }, 100)
}

// 监听聊天记录变化，自动滚动
watch(chatHistory, scrollToBottom)
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  padding: 0.5rem 1rem;
  border: none;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
}

.chat-layout {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.chat-section {
  flex: 0.4;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
  overflow: hidden;
}

.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.message {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.message.user {
  background: #e3f2fd;
  margin-left: 20%;
}

.message.assistant {
  background: #f5f5f5;
  margin-right: 20%;
}

.chat-input {
  padding: 1rem;
  border-top: 1px solid #eee;
  display: flex;
  gap: 1rem;
}

.chat-input textarea {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
}

.preview-section {
  flex: 0.6;
  display: flex;
  flex-direction: column;
}

.tabs {
  padding: 1rem;
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid #eee;
}

.tabs button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
}

.tabs button.active {
  border-bottom: 2px solid #1976d2;
  color: #1976d2;
}

.tab-content {
  flex: 1;
  overflow: auto;
  padding: 1rem;
}

.json-view pre,
.template-view pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.scene-introduction {
  padding: 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.introduction-content {
  font-size: 0.95rem;
  line-height: 1.6;
}

.introduction-content pre {
  white-space: pre-wrap;
  margin: 0;
  font-family: inherit;
}

.example-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.example-item {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.example-user {
  color: #666;
  margin-bottom: 0.25rem;
}

.example-assistant {
  color: #2196f3;
  margin-bottom: 0.5rem;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 1rem -1.5rem;
}

.chat-input button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.chat-input textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}
</style>