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
        template: {
            html: `<div class="character-card">
  <h3>{{name}}</h3>
  <div class="character-info">
    <p><strong>等级:</strong> {{level}}</p>
    <p><strong>职业:</strong> {{class}}</p>
  </div>
  <div class="character-skills">
    <h4>技能</h4>
    <ul>
      {{#each skills}}
        <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  <div class="character-desc">
    {{description}}
  </div>
</div>`,
            css: `.character-card {
  background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  margin: 20px auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.character-card h3 {
  color: #60a5fa;
  font-size: 28px;
  margin: 0 0 20px 0;
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
}

.character-info {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.character-info p {
  margin: 8px 0;
  font-size: 15px;
  color: #e5e7eb;
  display: flex;
  align-items: center;
  gap: 8px;
}

.character-info strong {
  color: #93c5fd;
  font-weight: 600;
  min-width: 60px;
}

.character-skills {
  margin-top: 20px;
}

.character-skills h4 {
  color: #60a5fa;
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.01em;
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
  background: rgba(96, 165, 250, 0.15);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  color: #93c5fd;
  border: 1px solid rgba(96, 165, 250, 0.2);
  transition: all 0.2s ease;
}

.character-skills li:hover {
  background: rgba(96, 165, 250, 0.25);
  transform: translateY(-1px);
}

.character-desc {
  margin-top: 20px;
  font-style: italic;
  color: #d1d5db;
  line-height: 1.6;
  text-align: justify;
  font-size: 15px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}`
        },
        tags: ['角色', 'RPG']
    },
    {
        id: '2',
        title: '简易菜谱生成器',
        description: '生成简单易懂的菜谱',
        introduction: `欢迎使用简易菜谱生成器！
            这是一个实用的工具，可以帮助你生成清晰的菜谱。
            你可以描述你想要的菜品，我会为你生成详细的制作步骤。`,
        systemPrompt: `你是一个专业的菜谱生成器。请根据用户的描述，生成一个详细的菜谱。

        你必须始终以JSON格式回复，包含以下字段：
- name: 菜品名称
    - description: 菜品描述
    - ingredients: 食材列表（数组）
    - steps: 制作步骤（数组）
    - tips: 烹饪技巧（字符串）

    示例格式：
    {
        "name": "番茄炒蛋",
        "description": "经典家常菜",
        "ingredients": ["番茄", "鸡蛋", "盐"],
        "steps": ["打散鸡蛋", "炒制"],
        "tips": "番茄切块"
    }`,
        examples: [
            {
                user: '生成一个番茄炒蛋的菜谱',
                assistant: '{"name":"番茄炒蛋","description":"经典家常菜","ingredients":["番茄","鸡蛋","盐"],"steps":["打散鸡蛋","炒制"],"tips":"番茄切块"}'
            }
        ],
        template: {
            html: `<div class="recipe-card">
    <div class="recipe-header">
        <h3>{{name}}</h3>
        <p>{{description}}</p>
    </div>
    <div class="recipe-ingredients">
        <h4>食材</h4>
        <ul>
            {{#each ingredients}}
                <li>{{this}}</li>
            {{/each}}
        </ul>
    </div>
    <div class="recipe-steps">
        <h4>步骤</h4>
        <ol>
            {{#each steps}}
                <li>{{this}}</li>
            {{/each}}
        </ol>
    </div>
    <div class="recipe-tips">
        <h4>小贴士</h4>
        <p>{{tips}}</p>
    </div>
</div>`,
            css: `.recipe-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 20px auto;
}

.recipe-header {
  margin-bottom: 20px;
}

.recipe-header h3 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0 0 8px 0;
}

.recipe-header p {
  color: #7f8c8d;
  margin: 0;
}

.recipe-ingredients {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.recipe-ingredients h4,
.recipe-steps h4,
.recipe-tips h4 {
  font-size: 18px;
  color: #2c3e50;
  margin: 0 0 12px 0;
}

.recipe-ingredients ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
}

.recipe-ingredients li {
  background: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  color: #34495e;
  font-size: 14px;
  border: 1px solid #e0e0e0;
}

.recipe-steps ol {
  padding-left: 20px;
  margin: 0;
}

.recipe-steps li {
  color: #34495e;
  margin-bottom: 12px;
  line-height: 1.5;
}

.recipe-steps li:last-child {
  margin-bottom: 0;
}

.recipe-tips {
  background: #fff3e0;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
}

.recipe-tips p {
  color: #e67e22;
  margin: 0;
  font-style: italic;
}`
        },
        tags: ['菜谱', '烹饪']
    },
    {
        "id": "3",
        "title": "极简读书笔记生成器",
        "description": "生成包含关键词、内容梗概和有趣观点的极简读书笔记",
        "introduction": "欢迎使用极简读书笔记生成器！\n这是一个帮助你快速记录和回顾书籍关键内容的工具。通过输入书籍的重要信息，生成一份简洁、有逻辑的读书笔记。",
        "systemPrompt": "你是一个专业的读书笔记生成器。请根据用户输入的书籍信息，生成一份包含关键词、内容梗概和有趣观点的极简读书笔记。\n\n你必须始终以JSON格式回复，包含以下字段：\n- keywords: 关键词（数组）\n- summary: 内容梗概（字符串）\n- interesting_points: 有趣观点（数组）\n\n示例格式：\n{\n  \"keywords\": [\"成长\", \"决策\", \"自我提升\"],\n  \"summary\": \"本书探讨了个人成长过程中的决策制定，如何通过自我提升实现更好的自我。\",\n  \"interesting_points\": [\"决策的质量直接影响个人成长\", \"自我认知是自我提升的基石\"]\n}",
        "tags": [
          "读书笔记",
          "极简"
        ],
        "examples": [
          {
            "user": "生成一份关于这本书的笔记：<书的内容略>",
            "assistant": "{\n  \"keywords\": [\"成长\", \"决策\", \"自我提升\"],\n  \"summary\": \"本书探讨了个人成长过程中的决策制定，如何通过自我提升实现更好的自我。\",\n  \"interesting_points\": [\"决策的质量直接影响个人成长\", \"自我认知是自我提升的基石\"]\n}"
          }
        ],
        "template": {
          "html": "<html>\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>读书笔记</title>\n</head>\n<body>\n    <div class=\"container\">\n        <div class=\"keywords-section\">\n            <div class=\"section-title\">\n                <span class=\"icon\">🏷️</span>\n                <h2>关键词</h2>\n            </div>\n            <div class=\"keywords-container\">\n                {{#each keywords}}\n                    <span class=\"keyword\">{{this}}</span>\n                {{/each}}\n            </div>\n        </div>\n\n        <div class=\"summary-section\">\n            <div class=\"section-title\">\n                <span class=\"icon\">📝</span>\n                <h2>内容梗概</h2>\n            </div>\n            <div class=\"summary-content\">\n                {{summary}}\n            </div>\n        </div>\n\n        <div class=\"points-section\">\n            <div class=\"section-title\">\n                <span class=\"icon\">💡</span>\n                <h2>有趣观点</h2>\n            </div>\n            <div class=\"points-container\">\n                {{#each interesting_points}}\n                    <div class=\"point-card\">\n                        <div class=\"point-content\">{{this}}</div>\n                    </div>\n                {{/each}}\n            </div>\n        </div>\n    </div>\n</body>\n</html>",
          "css": "body {\n    font-family: 'Helvetica Neue', Arial, sans-serif;\n    line-height: 1.6;\n    margin: 0;\n    padding: 0;\n    background: #f7f9fc;\n    color: #2c3e50;\n}\n\n.container {\n    max-width: 800px;\n    margin: 40px auto;\n    padding: 20px;\n}\n\n.section-title {\n    display: flex;\n    align-items: center;\n    margin-bottom: 25px;\n    border-bottom: 2px solid #e8ecf1;\n    padding-bottom: 10px;\n}\n\n.section-title h2 {\n    margin: 0;\n    font-size: 24px;\n    font-weight: 600;\n    color: #34495e;\n}\n\n.icon {\n    font-size: 24px;\n    margin-right: 12px;\n}\n\n/* Keywords Section */\n.keywords-section {\n    background: white;\n    padding: 25px;\n    border-radius: 12px;\n    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);\n    margin-bottom: 30px;\n}\n\n.keywords-container {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 10px;\n}\n\n.keyword {\n    background: #e3f2fd;\n    color: #1976d2;\n    padding: 6px 12px;\n    border-radius: 20px;\n    font-size: 14px;\n    font-weight: 500;\n    transition: all 0.3s ease;\n}\n\n.keyword:hover {\n    background: #1976d2;\n    color: white;\n    transform: translateY(-2px);\n}\n\n/* Summary Section */\n.summary-section {\n    background: white;\n    padding: 25px;\n    border-radius: 12px;\n    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);\n    margin-bottom: 30px;\n}\n\n.summary-content {\n    line-height: 1.8;\n    color: #485666;\n    text-align: justify;\n    padding: 10px;\n    background: #fafbfc;\n    border-radius: 8px;\n}\n\n/* Points Section */\n.points-section {\n    background: white;\n    padding: 25px;\n    border-radius: 12px;\n    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);\n}\n\n.points-container {\n    display: grid;\n    gap: 20px;\n}\n\n.point-card {\n    background: #fafbfc;\n    border-radius: 10px;\n    padding: 20px;\n    transition: all 0.3s ease;\n    border-left: 4px solid #3498db;\n}\n\n.point-card:hover {\n    transform: translateX(5px);\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n\n.point-content {\n    color: #485666;\n    line-height: 1.7;\n}\n\n/* Responsive Design */\n@media screen and (max-width: 600px) {\n    .container {\n        margin: 20px auto;\n        padding: 15px;\n    }\n\n    .keywords-section,\n    .summary-section,\n    .points-section {\n        padding: 15px;\n    }\n\n    .section-title h2 {\n        font-size: 20px;\n    }\n\n    .icon {"
        }
      }
]

export function getSceneById(id: string): Scene | undefined {
    // 先检查是否是自定义模板
    if (id.startsWith('custom_')) {
        const customTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]')
        return customTemplates.find((t: Scene) => t.id === id)
    }
    // 如果不是自定义模板，则使用内置场景
    return scenes.find(scene => scene.id === id)
}