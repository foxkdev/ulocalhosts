

import App from './renderer/App.svelte'
import "./renderer/app.css";

console.log('👋 This message is being logged by "renderer.js", included via Vite');
const app = new App({
  target: document.getElementById('app'),
})

export default app
