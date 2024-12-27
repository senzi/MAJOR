<template>
  <div v-if="visible" class="modal-overlay" @click="close">
    <div class="modal" @click.stop>
      <div class="modal-header">
        <h3>{{ scene.title }} - 预览</h3>
        <button class="close-button" @click="close">×</button>
      </div>
      <div class="modal-content">
        <div v-for="(example, index) in scene.examples" :key="index" class="example-preview">
          <div v-html="renderTemplate(JSON.parse(example.assistant))"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { compile } from 'handlebars'
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

const renderTemplate = (json: any) => {
  try {
    const template = compile(props.scene.template);
    return template(json);
  } catch (error) {
    console.error('Error rendering template:', error);
    return '模板渲染错误';
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
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0.5rem;
}

.close-button:hover {
  color: #2d3748;
}

.modal-content {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.example-preview {
  margin-bottom: 1.5rem;
}

.example-preview:last-child {
  margin-bottom: 0;
}
</style>
