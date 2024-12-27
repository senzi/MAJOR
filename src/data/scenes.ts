import type { Scene } from '@/types/scene'

export const scenes: Scene[] = [
  {
    id: '1',
    title: '角色生成器',
    description: '生成详细的角色设定',
    introduction: `欢迎使用角色生成器！
这是一个强大的工具，可以帮助你创建丰富多彩的角色设定。
你可以描述你想要的角色类型，我会为你生成完整的角色设定。`,
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
      {{#each skills}}
        <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  <p class="character-desc">{{description}}</p>
</div>`,
    templateData: (data) => {
      const template = `<div class="character-card">
  <div class="character-skills">
    <h4>技能:</h4>
    <ul>
      {{#each skills}}
        <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  <p class="character-desc">{{description}}</p>
</div>`;
      return template;
    },
    tags: ['角色', 'RPG']
  },
  {
    id: '2',
    title: '简易菜谱生成器',
    description: '生成创意菜品配方',
    introduction: `欢迎使用简易菜谱生成器！
这是一个帮助你探索美食创意的工具。
你可以描述你想要的菜品类型或者偏好，我会为你生成独特的菜品配方。`,
    systemPrompt: `你是一个专业的菜品创意师。请根据用户的描述，生成一个创意菜品配方。

你必须始终以JSON格式回复，包含以下字段：
- name: 菜品名称
- ingredients: 食材列表（数组）
- description: 菜品描述（包含口感、特色等）

示例格式：
{
  "name": "蜂蜜柠檬煎鸡胸",
  "ingredients": ["鸡胸肉", "蜂蜜", "柠檬", "迷迭香", "黑胡椒"],
  "description": "清新柠檬与甜蜜蜂蜜的完美结合，搭配嫩滑多汁的鸡胸肉，让这道菜充满地中海风情"
}`,
    examples: [
      {
        user: '想要一道清淡的鸡肉料理',
        assistant: '{"name":"蜂蜜柠檬煎鸡胸","ingredients":["鸡胸肉","蜂蜜","柠檬","迷迭香","黑胡椒"],"description":"清新柠檬与甜蜜蜂蜜的完美结合，搭配嫩滑多汁的鸡胸肉，让这道菜充满地中海风情"}'
      },
      {
        user: '需要一道素食沙拉',
        assistant: '{"name":"藜麦牛油果能量碗","ingredients":["藜麦","牛油果","樱桃番茄","菠菜","南瓜籽","柠檬汁"],"description":"营养丰富的藜麦配上奶油般的牛油果，搭配爽脆蔬菜和香脆南瓜籽，既美味又健康"}'
      }
    ],
    template: `<div style="
      background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 600px;
      margin: 20px auto;
    ">
      <div style="
        font-size: 24px;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        {{name}}
      </div>
      
      <div style="
        background: white;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 16px;
        color: #4a5568;
        line-height: 1.6;
      ">
        {{description}}
      </div>
      
      <div style="
        background: white;
        border-radius: 12px;
        padding: 16px;
      ">
        <div style="
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          {{ingredients.length}} 种食材
        </div>
        <div style="
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 8px;
        ">
          {{#each ingredients}}
          <div style="
            background: #f7fafc;
            padding: 8px 12px;
            border-radius: 8px;
            color: #4a5568;
            font-size: 14px;
          ">
            {{this}}
          </div>
          {{/each}}
        </div>
      </div>
    </div>`,
    tags: ['美食', '菜谱']
  }
]

export function getSceneById(id: string): Scene | undefined {
  return scenes.find(scene => scene.id === id)
}