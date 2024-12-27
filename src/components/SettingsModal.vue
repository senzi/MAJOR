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
            <h3>Why Moonshot?</h3>
            <ul>
              <li>支持中文对话</li>
              <li>响应速度快</li>
              <li>性价比高</li>
            </ul>
            <h3>How to get API Key:</h3>
            <ol>
              <li>访问 moonshot.com</li>
              <li>注册账号</li>
              <li>在控制台获取API Key</li>
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    padding: 1rem;
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .form-group {
    margin: 1rem 0;
  }
  
  .form-group input {
    width: 100%;
    padding: 0.5rem;
  }
  
  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;
  }
  </style>