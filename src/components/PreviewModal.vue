<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ scene.title }} - 预览</h3>
        <button class="close-button" @click="close">×</button>
      </div>
      <div class="modal-content">
        <div v-for="(example, index) in scene.examples" :key="index" class="example-preview">
          <div v-html="renderExample(example.assistant)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { renderTemplate } from '@/services/template'
import type { Scene } from '@/types/scene'

const props = defineProps<{
  scene: Scene
  visible: boolean
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>()

const close = () => {
  emit('update:visible', false)
}

const renderExample = (example: string) => {
  try {
    const json = JSON.parse(example)
    if (props.scene.template) {
      return renderTemplate(props.scene.template, json)
    }
    return ''
  } catch (error) {
    console.error('Error rendering example:', error)
    return '渲染错误'
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
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  animation: scaleIn var(--transition) ease-out;
}

.modal-header {
  padding: var(--spacing-4);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  font-size: var(--font-size-xl);
  color: var(--text-primary);
  margin: 0;
}

.close-button {
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

.close-button:hover {
  background-color: var(--background);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
}

.example-preview {
  margin-bottom: var(--spacing-4);
}

.example-preview:last-child {
  margin-bottom: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
