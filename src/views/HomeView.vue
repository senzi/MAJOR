<template>
  <div class="home">
    <div class="header">
      <AppHeader />
    </div>
    <div class="content">
      <div class="project-intro">
        <h2>MAJOR</h2>
        <p class="subtitle">
          <span class="highlight">M</span>oonshot
          <span class="highlight">A</span>ssisted
          <span class="highlight">J</span>SON
          <span class="highlight">O</span>utput
          <span class="highlight">R</span>enderer
        </p>
        <p class="description">将 Moonshot 的 JSON 响应转换为交互式可视化视图的工具集</p>
        <div class="api-guide">
          <p>🔑 在开始之前，请先前往 <a href="https://platform.moonshot.cn/" target="_blank">Moonshot Platform</a> 获取 API Key</p>
        </div>
        <div class="intro-features">
          <div class="feature">
            <span class="feature-icon">🔄</span>
            <p>智能转换</p>
          </div>
          <div class="feature">
            <span class="feature-icon">🎨</span>
            <p>可视化渲染</p>
          </div>
          <div class="feature">
            <span class="feature-icon">⚡️</span>
            <p>灵活定制</p>
          </div>
        </div>
      </div>
      <div class="scenes-grid">
        <SceneCard 
          v-for="scene in allScenes" 
          :key="scene.id" 
          :scene="scene" 
          @click="goToChat(scene)"
          @preview="previewScene(scene)"
        >
          <template #actions v-if="scene.id.startsWith('custom_')">
            <button class="edit-button" @click.stop="editTemplate(scene)">
              编辑
            </button>
          </template>
        </SceneCard>
        <div class="add-template-card" @click="router.push('/template/new')">
          <div class="add-icon">+</div>
          <p>新建模板</p>
        </div>
      </div>
    </div>
    <AppFooter />
    <PreviewModal v-model:visible="previewVisible" :scene="selectedScene" v-if="selectedScene" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const allScenes = computed(() => {
  const customTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]')
  return [...scenes, ...customTemplates]
})

const goToChat = (scene: Scene) => {
  // 如果是自定义模板，使用 custom_ 前缀
  const sceneId = scene.id.startsWith('custom_') ? scene.id : scene.id
  router.push(`/chat/${sceneId}`)
}

const previewScene = (scene: Scene) => {
  selectedScene.value = scene
  previewVisible.value = true
}

const editTemplate = (scene: Scene) => {
  router.push(`/template/${scene.id}`)
}
</script>

<style scoped>
.home {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
}

.header {
  padding: var(--spacing-4);
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-4);
}

.project-intro {
  text-align: center;
  padding: var(--spacing-2) 0;
  margin-bottom: var(--spacing-4);
}

.project-intro h2 {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.2;
}

.project-intro .subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-base);
  margin: var(--spacing-1) 0 0 0;
}

.project-intro .description {
  max-width: 600px;
  margin: 1.5rem auto;
  color: var(--color-text);
  line-height: 1.6;
  font-size: 1.1rem;
}

.api-guide {
  background: linear-gradient(to right, var(--color-background-soft), var(--background));
  border-radius: 12px;
  padding: 1rem;
  max-width: 600px;
  margin: 2rem auto;
  border: 1px solid var(--border);
}

.api-guide p {
  margin: 0;
  color: var(--color-text);
}

.api-guide a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.api-guide a:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.intro-features {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2.5rem;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.feature-icon {
  font-size: 2rem;
  transform: scale(1);
  transition: transform 0.2s ease;
}

.feature:hover .feature-icon {
  transform: scale(1.1);
}

.feature p {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text);
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scenes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-4);
  height: fit-content;
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

.add-template-card {
  background: linear-gradient(135deg, var(--surface), var(--background));
  border: 2px dashed var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-4);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  transition: all 0.2s ease;
  min-height: 200px;
}

.add-template-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.add-icon {
  font-size: 2rem;
  color: var(--color-text-light);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-2);
}

.add-template-card p {
  margin: 0;
  color: var(--color-text-light);
  font-size: 0.9rem;
}

.edit-button {
  padding: var(--spacing-1) var(--spacing-3);
  background-color: var(--color-background-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.edit-button:hover {
  background-color: var(--color-background);
  border-color: var(--color-primary);
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