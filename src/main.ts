import { createSSRApp } from 'vue'
import 'uno.css'
import * as Pinia from 'pinia'
import App from './App.vue'
import 'nutui-uniapp/styles/index.scss'

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  return {
    app,
    Pinia,
  }
}
