import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { Button,Input, message,Radio,RadioGroup,RadioButton,Row,Col,Checkbox,Popconfirm,Divider,QRCode} from 'ant-design-vue';

const app = createApp(App)

/* 会自动注册 Button 下的子组件, 例如 Button.Group */
app.use(Button)
app.use(Input)
app.use(Radio)
app.use(RadioGroup)
app.use(RadioButton)
app.use(Row)
app.use(Col)
app.use(Checkbox)
app.use(Popconfirm)
app.use(Divider)
app.use(QRCode)
app.config.globalProperties.$message = message;
app.mount('#app')