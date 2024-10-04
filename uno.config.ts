import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [presetUno(), presetIcons(), presetAttributify()],
  shortcuts: {
    'title-text':
      'text-[#e59c21] text-shadow-[rgb(255,153,0)_0px_0px_1px,rgba(249,164,0,0.6)_0px_0px_5px,rgba(249,164,0,0.4)_0px_5px_4px]',
  },
})
