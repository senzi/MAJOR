<template>
    <div v-if="visible" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2>Settings</h2>
          <button @click="close">×</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>Moonshot API Key</label>
            <input 
              type="password"
              v-model="localApiKey"
              placeholder="Enter your API key"
            >
          </div>
          <div class="info-section">
            <h3>为什么选择 Moonshot?</h3>
            <ul>
              <li>原生支持JSON输出模式，提供结构化且可靠的数据响应</li>
              <li>强大的中文理解和生成能力</li>
              <li>低延迟、高性能的API服务</li>
              <li>合理的价格和灵活的计费方式</li>
            </ul>
            <h3>如何获取 API Key</h3>
            <ol>
              <li>访问 <a href="https://platform.moonshot.cn/" target="_blank">Moonshot开发者平台</a></li>
              <li>注册/登录开发者账号</li>
              <li>在控制台创建获取API Key</li>
              <li>将获取到的API Key填入上方输入框</li>
            </ol>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="close">Cancel</button>
          <button @click="save">Save</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { apiService } from '@/services/api'
  
  const props = defineProps<{
    visible: boolean
  }>()
  
  const emit = defineEmits<{
    'update:visible': [visible: boolean]
  }>()
  
  const localApiKey = ref(apiService.getApiKey())
  
  const close = () => {
    emit('update:visible', false)
  }
  
  const save = () => {
    try {
      apiService.setApiKey(localApiKey.value)
      close()
    } catch (error) {
      console.error('Failed to save API key:', error)
      // TODO: 显示错误提示
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn var(--transition) ease-out;
  }

  .modal {
    background-color: var(--surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    width: 90%;
    max-width: 500px;
    animation: scaleIn var(--transition) ease-out;
  }

  .modal-header {
    padding: var(--spacing-4);
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .modal-header h2 {
    font-size: var(--font-size-xl);
    color: var(--text-primary);
    margin: 0;
  }

  .modal-header button {
    background: none;
    border: none;
    font-size: var(--font-size-xl);
    color: var(--text-secondary);
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    transition: var(--transition);
  }

  .modal-header button:hover {
    background-color: var(--border);
    color: var(--text-primary);
  }

  .modal-body {
    padding: var(--spacing-6);
  }

  .form-group {
    margin-bottom: var(--spacing-6);
  }

  .form-group label {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-bottom: var(--spacing-2);
  }

  .form-group input {
    width: 100%;
    padding: var(--spacing-3);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-size: var(--font-size-base);
    transition: var(--transition);
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }

  .info-section {
    padding: var(--spacing-4);
  }

  .info-section h3 {
    margin: var(--spacing-4) 0 var(--spacing-2);
    font-size: 1rem;
    color: var(--color-text);
  }

  .info-section h3:first-child {
    margin-top: 0;
  }

  .info-section ul,
  .info-section ol {
    margin: 0;
    padding-left: var(--spacing-6);
  }

  .info-section li {
    margin: var(--spacing-2) 0;
    color: var(--color-text-light);
    line-height: 1.5;
  }

  .info-section a {
    color: var(--color-primary);
    text-decoration: none;
  }

  .info-section a:hover {
    text-decoration: underline;
  }

  .modal-footer {
    padding: var(--spacing-4);
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-2);
  }

  .modal-footer button {
    padding: var(--spacing-2) var(--spacing-4);
    border-radius: var(--radius);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
  }

  .modal-footer button:first-child {
    border: 1px solid var(--border);
    background-color: white;
    color: var(--text-secondary);
  }

  .modal-footer button:first-child:hover {
    background-color: var(--background);
    color: var(--text-primary);
  }

  .modal-footer button:last-child {
    background-color: var(--primary);
    color: white;
    border: none;
  }

  .modal-footer button:last-child:hover {
    background-color: var(--primary-dark);
  }
  </style>