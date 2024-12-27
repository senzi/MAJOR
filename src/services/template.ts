import { compile } from 'handlebars'

export const renderTemplate = (template: { html: string, css: string }, data: any) => {
  try {
    const compiledTemplate = compile(template.html)
    const renderedHtml = compiledTemplate(data)
    return `<style>${template.css}</style>${renderedHtml}`
  } catch (error) {
    console.error('Error rendering template:', error)
    return '模板渲染错误'
  }
}

export const getTemplateContent = (template: { html: string, css: string }) => {
  return {
    html: template.html.trim(),
    css: template.css.trim()
  }
}
