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
            <pre class="introduction-text">{{ currentScene?.introduction }}</pre>
          </div>
          <div class="example-section">
            <h4>示例：</h4>
            <div v-for="(example, index) in currentScene?.examples" :key="index" class="example-item">
              <div class="example-user">
                <span class="icon">👤</span>
                <span class="content">{{ example.user }}</span>
              </div>
              <div class="example-assistant">
                <span class="icon">🤖</span>
                <pre class="json-content">{{ formatJson(example.assistant) }}</pre>
              </div>
            </div>
          </div>
          <div class="divider"></div>
        </div>
        <!-- 聊天历史 -->
        <div class="chat-history" ref="chatHistoryRef">
          <div v-for="(msg, index) in chatHistory" :key="index" :class="['message', msg.role]">
            <div class="message-content">
              <pre v-if="msg.role === 'assistant'" class="json-content">{{ formatJson(msg.content) }}</pre>
              <span v-else>{{ msg.content }}</span>
            </div>
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
          <div v-show="activeTab === 'json'" class="json-section">
            <pre v-if="currentJson !== '{}'" class="json-content">{{ currentJson }}</pre>
            <div v-else class="empty-json">
              <div class="empty-icon">{ }</div>
              <p>在左边进行对话后</p>
              <p>这里能查看API输出的原始JSON</p>
            </div>
          </div>

          <!-- Prompt 展示 -->
          <div v-if="activeTab === 'prompt'" class="prompt-view">
            <pre class="prompt-text">{{ currentScene?.systemPrompt }}</pre>
          </div>

          <!-- 预览展示 -->
          <div v-if="activeTab === 'preview'" class="preview-view">
            <div class="preview-wrapper" ref="previewRef">
              <div id="preview-content" v-html="renderedContent"></div>
            </div>
            <div class="preview-actions">
              <button 
                class="download-button" 
                @click="downloadPreview" 
                :disabled="downloading"
              >
                <span v-if="downloading">下载中...</span>
                <span v-else>下载图片</span>
              </button>
            </div>
          </div>

          <!-- 模板展示 -->
          <div v-if="activeTab === 'template'" class="template-view">
            <div class="template-header">
              <h3>Handlebars 模板</h3>
              <div class="template-info">
                <p>我们使用 Handlebars 作为模板引擎，常用语法：</p>
                <ul>
                  <li><code>&#123;&#123;variable&#125;&#125;</code> - 显示变量</li>
                  <li><code>&#123;&#123;#each items&#125;&#125; ... &#123;&#123;/each&#125;&#125;</code> - 循环数组</li>
                  <li>
                    <code>&#123;&#123;#if condition&#125;&#125; ... &#123;&#123;else&#125;&#125; ... &#123;&#123;/if&#125;&#125;</code>
                    - 条件判断
                  </li>
                  <li><code>&#123;&#123;#with object&#125;&#125; ... &#123;&#123;/with&#125;&#125;</code> - 改变上下文</li>
                </ul>
                <p>更多语法请参考 <a href="https://handlebarsjs.com/guide/" target="_blank">Handlebars 官方文档</a></p>
              </div>
            </div>
            <div class="template-content">
              <div class="template-section">
                <h4>HTML Template</h4>
                <pre>{{ templateContent.html }}</pre>
              </div>
              <div class="template-section">
                <h4>CSS Styles</h4>
                <pre>{{ templateContent.css }}</pre>
              </div>
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
import { apiService, type Message } from '@/services/api'
import type { Scene } from '@/types/scene'
import { renderTemplate, getTemplateContent } from '@/services/template'
import html2canvas from 'html2canvas'

const route = useRoute()
const router = useRouter()
const settingsStore = useSettingsStore()

const currentScene = ref<Scene | null>(null)
const chatHistory = ref<Array<{ role: string, content: string }>>([])
const newMessage = ref('')
const chatHistoryRef = ref<HTMLElement | null>(null)
const loading = ref(false)
const activeTab = ref<'json' | 'prompt' | 'preview' | 'template'>('preview')
const currentJson = ref('{}')
const previewRef = ref<HTMLElement | null>(null)
const downloading = ref(false)

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

const formatJson = (jsonString: string) => {
  try {
    return JSON.stringify(JSON.parse(jsonString), null, 2)
  } catch {
    return jsonString
  }
}

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
    const messages: Message[] = [
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

const downloadPreview = async () => {
  if (!previewRef.value || downloading.value) return
  
  downloading.value = true
  try {
    const element = previewRef.value
    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      useCORS: true, // 允许跨域图片
      logging: false,
      backgroundColor: '#ffffff',
      onclone: (clonedDoc) => {
        // 确保克隆的元素样式已完全加载
        const clonedElement = clonedDoc.querySelector('.preview-wrapper')
        if (clonedElement) {
          clonedElement.style.visibility = 'visible'
        }
      }
    })

    // 创建下载链接
    const link = document.createElement('a')
    link.download = `preview-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('下载预览图失败:', error)
    alert('下载预览图失败，请重试')
  } finally {
    downloading.value = false
  }
}

watch(chatHistory, scrollToBottom)
</script>

<style scoped>
.chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  overflow-y: auto;
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
  overflow-y: auto;
  padding: var(--spacing-4);
  min-width: 0;
  border-right: 1px solid var(--border);
}

.scene-introduction {
  background-color: var(--background);
  border-radius: var(--radius);
  margin-bottom: var(--spacing-4);
  max-height: 40vh;
  overflow-y: auto;
}

.introduction-content {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border);
}

.introduction-text {
  margin: 0;
  padding: var(--spacing-4);
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.6;
  color: var(--color-text);
}

.example-section {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border);
}

.example-section h4 {
  margin: 0 0 var(--spacing-4) 0;
  color: var(--text-primary);
}

.example-item {
  margin-bottom: var(--spacing-4);
  padding: var(--spacing-2);
  background-color: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}

.example-item:last-child {
  margin-bottom: 0;
}

.example-user,
.example-assistant {
  display: flex;
  gap: var(--spacing-2);
  padding: var(--spacing-2);
}

.example-user .icon,
.example-assistant .icon {
  flex-shrink: 0;
}

.example-user .content,
.example-assistant pre.json-content {
  flex: 1;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
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

.json-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.json-content {
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  padding: var(--spacing-2);
  background-color: var(--color-background-soft);
  border-radius: var(--radius);
  font-size: 0.9rem;
  line-height: 1.4;
}

.empty-json {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-light);
  text-align: center;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: var(--spacing-4);
  opacity: 0.5;
}

.empty-json p {
  margin: var(--spacing-1) 0;
  font-size: 0.9rem;
}

.message-content pre {
  max-height: 400px;
  overflow: auto;
}

.prompt-view pre {
  margin: 0;
  padding: var(--spacing-4);
  background-color: var(--surface);
  border-radius: var(--radius);
  overflow-x: auto;
  white-space: pre-line;
  word-break: break-word;
  color: var(--text-primary);
  font-family: monospace;
  line-height: 1.5;
  flex: 1;
  border: 1px solid var(--border);
}

.prompt-text {
  margin: 0;
  padding: var(--spacing-4);
  white-space: pre-line;
  word-break: break-word;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-background-soft);
  border-radius: var(--radius);
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

.preview-wrapper {
  background-color: var(--background);
  min-height: 100px;
  padding: 20px;
}

#preview-content {
  width: 100%;
}

.preview-actions {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  padding: 12px;
  background: var(--surface);
  border-top: 1px solid var(--border);
}

.download-button {
  background: linear-gradient(135deg, #1a73e8, #0d47a1);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  min-width: 120px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.download-button:hover {
  background: linear-gradient(135deg, #1557b0, #0a3578);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.download-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.download-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.template-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  flex: 1;
}

.template-header {
  margin-bottom: var(--spacing-4);
}

.template-info {
  background-color: var(--color-background-soft);
  border-radius: var(--radius);
  padding: var(--spacing-4);
  margin-top: var(--spacing-2);
}

.template-info p {
  margin: var(--spacing-2) 0;
  color: var(--color-text);
}

.template-info ul {
  margin: var(--spacing-2) 0;
  padding-left: var(--spacing-6);
}

.template-info li {
  margin: var(--spacing-2) 0;
  color: var(--color-text-light);
}

.template-info code {
  background-color: var(--color-background);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-family: monospace;
}

.template-info a {
  color: var(--color-primary);
  text-decoration: none;
}

.template-info a:hover {
  text-decoration: underline;
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