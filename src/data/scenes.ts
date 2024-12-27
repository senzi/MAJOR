import type { Scene } from '@/types/scene'

export const scenes: Scene[] = [
  {
    id: '1',
    title: '角色生成器',
    description: '生成详细的角色设定',
    introduction: `欢迎使用角色生成器！
这是一个强大的工具，可以帮助你创建丰富多彩的角色设定。
你可以描述你想要的角色类型，我会为你生成完整的角色信息。`,
    systemPrompt: `你是一个专业的角色设定生成器。请根据用户的描述，生成一个完整的角色设定。

你必须始终以JSON格式回复，包含以下字段：
- name: 角色名字
- level: 等级（数字）
- class: 职业
- skills: 技能列表（数组）
- description: 角色描述

示例格式：
{
  "name": "星辰法师",
  "level": 5,
  "class": "法师",
  "skills": ["星光术", "空间跳跃"],
  "description": "来自遥远星空的神秘法师"
}`,
    examples: [
      {
        user: '生成一个魔法师角色',
        assistant: '{"name":"星辰法师","level":5,"class":"法师","skills":["星光术","空间跳跃"],"description":"来自遥远星空的神秘法师"}'
      }
    ],
    template: `<style>
  .character-card {
    background: linear-gradient(145deg, #2a2a2a, #3a3a3a);
    border-radius: 15px;
    padding: 20px;
    color: #fff;
    font-family: 'Arial', sans-serif;
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
    max-width: 400px;
    margin: 20px auto;
  }

  .character-card h3 {
    color: #4fc3f7;
    font-size: 24px;
    margin: 0 0 15px 0;
    text-align: center;
    text-shadow: 0 0 10px rgba(79,195,247,0.3);
  }

  .character-info {
    background: rgba(0,0,0,0.2);
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
  }

  .character-info p {
    margin: 5px 0;
    font-size: 16px;
    color: #e0e0e0;
  }

  .character-skills {
    margin-top: 15px;
  }

  .character-skills h4 {
    color: #4fc3f7;
    margin: 0 0 10px 0;
    font-size: 18px;
  }

  .character-skills ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .character-skills li {
    background: rgba(79,195,247,0.2);
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 14px;
  }

  .character-desc {
    margin-top: 15px;
    font-style: italic;
    color: #bdbdbd;
    line-height: 1.5;
    text-align: justify;
  }
</style>

<div class="character-card">
  <h3>{{name}}</h3>
  <div class="character-info">
    <p>等级: {{level}}</p>
    <p>职业: {{class}}</p>
  </div>
  <div class="character-skills">
    <h4>技能:</h4>
    <ul>
      {{skills_list}}
    </ul>
  </div>
  <p class="character-desc">{{description}}</p>
</div>`,
    templateData: (data) => {
      const template = `<div class="character-card">
  <div class="character-skills">
    <h4>技能:</h4>
    <ul>
      {{skills_list}}
    </ul>
  </div>
  <p class="character-desc">{{description}}</p>
</div>`;
      const skills_list = data.skills.map(skill => `<li>${skill}</li>`).join('');
      return template.replace('{{skills_list}}', skills_list);
    },
    tags: ['角色', 'RPG']
  }
]

export function getSceneById(id: string): Scene | undefined {
  return scenes.find(scene => scene.id === id)
}