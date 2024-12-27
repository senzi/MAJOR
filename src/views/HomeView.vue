<template>
  <div class="home-container">
    <div class="home-header">
      <AppHeader />
    </div>
    <div class="home-content">
      <div class="project-intro">
        <h2>MAJOR</h2>
        <p>一个基于大语言模型的AI助手</p>
        <div class="intro-icons">
          <div class="intro-icon">
            <span>🤖</span>
            <p>智能对话</p>
          </div>
          <div class="intro-icon">
            <span>🎨</span>
            <p>模板生成</p>
          </div>
          <div class="intro-icon">
            <span>⚡️</span>
            <p>快速响应</p>
          </div>
        </div>
      </div>
      <div class="scenes-grid">
        <SceneCard
          v-for="scene in scenes"
          :key="scene.id"
          :scene="scene"
          @click="goToChat(scene)"
          @preview="previewScene(scene)"
        />
      </div>
    </div>
    <AppFooter />
    <PreviewModal
      v-model:visible="previewVisible"
      :scene="selectedScene"
      v-if="selectedScene"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import SceneCard from '@/components/SceneCard.vue'
import PreviewModal from '@/components/PreviewModal.vue'
import { scenes } from '@/data/scenes'
import type { Scene } from '@/types/scene'

const router = useRouter()
const previewVisible = ref(false)
const selectedScene = ref<Scene | null>(null)

const goToChat = (scene: Scene) => {
  router.push(`/chat/${scene.id}`)
}

const previewScene = (scene: Scene) => {
  selectedScene.value = scene
  previewVisible.value = true
}
</script>

<style scoped>
.home-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  overflow: hidden;
}

.home-header {
  flex-shrink: 0;
}

.home-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  padding: var(--spacing-4);
}

.project-intro {
  text-align: center;
  margin-bottom: var(--spacing-8);
  flex-shrink: 0;
}

.project-intro h2 {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin: 0 0 var(--spacing-2) 0;
}

.project-intro p {
  color: var(--text-secondary);
  margin: 0;
}

.intro-icons {
  display: flex;
  justify-content: center;
  gap: var(--spacing-8);
  margin-top: var(--spacing-6);
}

.intro-icon {
  text-align: center;
}

.intro-icon span {
  font-size: 2rem;
}

.scenes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-4);
  overflow-y: auto;
  padding: var(--spacing-2);
  align-items: start;
  flex: 1;
}

.scene-card {
  background-color: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
  transition: var(--transition);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  height: 200px;
  min-height: 200px;
  max-height: 200px;
}

.scene-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.scene-title {
  font-size: var(--font-size-lg);
  color: var(--text-primary);
  margin: 0;
}

.scene-description {
  color: var(--text-secondary);
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.5;
}

.scene-tags {
  display: flex;
  gap: var(--spacing-2);
  flex-wrap: wrap;
  margin-top: auto;
}

.scene-tag {
  background-color: var(--primary-light);
  color: white;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
}

.preview-button {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  font-size: var(--font-size-sm);
  width: 100%;
  margin-top: auto;
}

.preview-button:hover {
  background-color: var(--primary-dark);
}

/* 为 AppHeader 组件添加样式 */
:deep(.app-header) {
  padding: var(--spacing-4) var(--spacing-8);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
}

:deep(.app-header h1) {
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  margin: 0;
}

:deep(.settings-button) {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  transition: var(--transition);
}

:deep(.settings-button:hover) {
  background-color: var(--background);
  color: var(--primary);
}

:deep(.settings-button svg) {
  width: 24px;
  height: 24px;
}
</style>