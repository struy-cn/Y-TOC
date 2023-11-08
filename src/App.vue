<template>
  <div style="max-width: 430px;
    min-width: 375px;">
    <div v-if="image" style="width: 100%;">
      <!-- 生成的图像 -->
      <img  :src="image" style="width: 100%;" />
    </div>
    <div id="course-container" :class="`${color} ${tocSmallWidth?'toc-small':''}`" :style="{backgroundColor: colorConfigs[color]['background']}" v-else>
      <div class="toc title" :style="{backgroundColor: colorConfigs[color]['titleBackground']}" >
        <div class="input-span" contenteditable="plaintext-only" v-text="courseTitle" @blur="setValue('courseTitle', $event.target.innerHTML)"></div>
        <span class="left-bg"></span><span class="right-bg"></span> <span class="left-line"></span><span class="right-line"></span>
      </div>
      <div class="toc item" v-for="(item, index) in items" :key="index">
        <span class="index" :style="{color: colorConfigs[color]['tocIndexColor']}">{{ startNumber(index) }}</span>
        <span :style="{color: colorConfigs[color]['tocTitleColor']}" class="input-span" contenteditable="plaintext-only" v-text="item.text" @blur="setValue2(item,'text', $event.target.innerHTML)"></span>
      </div>
      <div class="toc more" :style="{backgroundColor: colorConfigs[color]['moreBackground']}">
        <span contenteditable="plaintext-only" class="input-span">......</span><br>
        <div class="input-span" contenteditable="plaintext-only" v-text="courseMore" @blur="setValue('courseMore', $event.target.innerHTML)"></div>
        <span class="left-bg"></span><span class="right-bg"></span><span class="left-line"></span><span class="right-line"></span>
      </div>
      <div style="margin-bottom: 10px;" v-if="showQRCode">
        <a-divider style="width: 90%;margin:0;"></a-divider>
        <div class="footer-center">
          <span contenteditable="plaintext-only" class="input-span" v-text="QRcodeSelect.message" @blur="setValue2(QRcodeSelect,'message', $event.target.innerHTML)" style="font-size: 12px;" :style="{color: colorConfigs[color]['moreBackground']}"></span>
        </div>
        <!-- 居中显示二维码 -->
        <div class="qrcode">
          <div v-if="QRcodeSelect.isFlie&&QRcodeSelect.file" >
            <img v-for="(f,index) in QRcodeSelect.file" :key="index" style="width: 100px;height: 100px;border-radius: 4px;object-fit: cover;"  :src="f" @click="showQRcodeChange"/>
          </div>
          <a-qrcode v-else  :size="100" errorLevel="H" :value="QRcodeSelect.data" :color="colorConfigs[color]['moreBackground']"  @click="showQRcodeChange" />
        </div>
      </div>
    </div>
    <div id="options">
      <div v-if="!image">
        <a-row v-if="showQRCode">
          <a-col :span="24">
            <p class="footer-center">将以下链接转换为二维码</p>
            <a-input class="footer-center" placeholder="输入链接更新二维码" v-model:value="QRcodeSelect.data" @change="() => {QRcodeSelect.isFlie = false;saveData()}"></a-input>
            <a-upload
            :show-upload-list="false"
            class="footer-center"
            style="display: block;"
              :maxCount="2"
              accept="image/*"
              @change="QRcodeFileChange"
              :before-upload="beforeQRcodeUpload"
            >
              <a-button ref="uploadQRcodeRef">或上传图片(小于2MB，最多2张)</a-button>
            </a-upload>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="6">
            <a-popconfirm
              title="确认清空填写的内容吗?"
              ok-text="确认"
              cancel-text="取消"
              @confirm="clearItem()"
            >
              <a-button class="footer-center"  >清空内容</a-button>
            </a-popconfirm>
          </a-col>
          <a-col :span="6">
            <a-button class="footer-center" @click="showBatchInput">{{ batchInput.show?'输入完成':'批量输入' }}</a-button>
          </a-col>
          <a-col :span="6">
            <a-button class="footer-center"  @click="removeItem(items.length - 1)" >-</a-button>
          </a-col>
          <a-col :span="6">
            <a-button class="footer-center"  @click="addItem">+</a-button>
          </a-col>
        </a-row>
        <a-row v-if="batchInput.show">
          <a-col :span="24">
            <p class="footer-center">批量输入目录内容，换行分隔，自动排序</p>
            <a-textarea v-model:value="batchInput.data" @blur="batchInputOk" @change="batchInputItem" placeholder="一行作为一个标题，可粘贴整理好的换行内容，有序号会自动去除" :auto-size="{ minRows: 5, maxRows: 20 }"></a-textarea>
          </a-col>
        </a-row>
        <p v-if="!batchInput.show" style="text-align: center;">点击内容进行编辑，选择主题，生成图片</p>
        <div class="footer-center">
          <a-radio-group style="width: 100%;" v-model:value="color" @change="saveData">
            <a-radio-button v-for="(value, key) in colorConfigs" :key="key" :style="{backgroundColor: value.background,color:key === 'morebule'?'#fff':''}" :value="key">{{ value.name }}</a-radio-button>
          </a-radio-group>
        </div>
        <a-row>
          <a-col :span="24" style="text-align: center;">
            <a-checkbox  v-model:checked="startNumberZero" @change="saveData" >序号从0开始</a-checkbox>
            <a-checkbox  v-model:checked="tocSmallWidth" @change="saveData" >目录窄一点</a-checkbox>
            <a-checkbox  v-model:checked="showQRCode" @change="saveData" >底部二维码</a-checkbox>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24" style="text-align: center;">
            <a-button class="footer-center"  @click="shareImage">图片预览</a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12" style="text-align: center;">
            <a-button class="footer-center"  @click="openSaveAs">另存当前配置到本地</a-button>
          </a-col>
          <a-col :span="12" style="text-align: center;">
            <a-button class="footer-center"  @click="showAllConfig">选择已保存配置({{ savedTocs.data.length }})</a-button>
          </a-col>
        </a-row>
        <a-row  v-if="savedTocs.show">
          <a-col :span="24">
            <a-input class="footer-center" v-model:value="currConfigTitle" placeholder="输入当前配置名称，并点击保存" ></a-input>
            <a-button class="footer-center" @click="saveAs" >保存</a-button>
          </a-col>
        </a-row>
        <a-row v-if="allConfigShow">
          <a-col :span="24">
            <p v-if="savedTocs.data.length > 0" class="footer-center">点击替换当前设置，点击x删除配置</p>
            <p v-else class="footer-center">暂无配置，最多可保存 10 个配置</p>
            <template v-for="(item, index) in savedTocs.data" :key="index">
              <div style="width: 90%;margin: 5px 5%;">
                <a-popconfirm
                  title="确认替换当前内容和配置吗?"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="useThisConfig(item)"
                >
                  <a-button style="width: 85%;" type="dashed">{{ item.configName }}</a-button >
                </a-popconfirm>
                <a-popconfirm
                  title="删除此配置吗?"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="deleteThisConfig(index)"
                >
                  <a-button style="width: 15%;" type="link" danger>x</a-button>
                </a-popconfirm>
              </div>
            </template>
          </a-col>
        </a-row>
      </div>
      <template v-else>
        <p style="text-align: center;">微信请长按分享或保存图片<br>浏览器可右键或点击下方按钮保存</p>
        <a-button class="footer-center"  @click="dowloadImage">下载图片</a-button>
        <a-button class="footer-center"  @click="()=> image = ''">返回编辑</a-button>
      </template>
    </div>
  <div class="footer">
    <p><a href="https://struy.cn/">StruggleYang</a>© 2023｜<a href="https://note.mowen.cn/note-intro/?noteUuid=VCM-EtZ94BrA5o4TBc1R3">打赏作者￥</a>｜<a href="https://github.com/struy-cn/Y-TOC">Github</a></p>
  </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

const localDataKey = "localMasterData"
const localSaveDataKey = "localSaveTocs"
// 颜色全局配置
const colorConfigs = {
  pink:{
    name:'芭比粉',
    background:'#f5e5eb',
    titleBackground:'#71403f',
    moreBackground:'#c48080',
    tocIndexColor:'#963e5b',
    tocTitleColor:'#412A2D'
  },
  green:{
    name:'清新绿',
    background:'#d9f7be',
    titleBackground:'#5d864b',
    moreBackground:'#8cc972',
    tocIndexColor:'#2c6912',
    tocTitleColor:'#48633c'
  },
  bule:{
    name:'沉稳蓝',
    background:'#e6f4ff',
    titleBackground:'#5c78a5',
    moreBackground:'#8eb0e5',
    tocIndexColor:'#1349a0',
    tocTitleColor:'#40516d'
  },
  morebule:{
    name:'法律蓝',
    background:'#0b419a',
    titleBackground:'#1173ce',
    moreBackground:'#82a7e2',
    tocIndexColor:'#0b419a',
    tocTitleColor:'#1f3336'
  },
  red:{
    name:'热烈红',
    background:'#ffccc7',
    titleBackground:'#8f282d',
    moreBackground:'#db787d',
    tocIndexColor:'#8d050c',
    tocTitleColor:'#5a1a1d'
  },
  golden:{
    name:'高贵金',
    background:'#fff1b8',
    titleBackground:'#9e7020',
    moreBackground:'#f1c475',
    tocIndexColor:'#ac7414',
    tocTitleColor:'#664815'
  },
  'rmb-100':{
    name:'至尊100',
    background:'#f5abb7',
    titleBackground:'#cb364a',
    moreBackground:'#d55f6f',
    tocIndexColor:'#be0f2d',
    tocTitleColor:'#be0f2d'
  },
  'rmb-50':{
    name:'璀璨50',
    background:'#a7d4c3',
    titleBackground:'#3d6756',
    moreBackground:'#509a80',
    tocIndexColor:'#3d6756',
    tocTitleColor:'#3d6756'
  },
  'rmb-20':{
    name:'荣耀20',
    background:'#dba880',
    titleBackground:'#8d4b45',
    moreBackground:'#a05d46',
    tocIndexColor:'#8d4b45',
    tocTitleColor:'#8d4b45'
  },
  'rmb-10':{
    name:'灵动10',
    background:'#94d2ef',
    titleBackground:'#355386',
    moreBackground:'#5091c0',
    tocIndexColor:'#355386',
    tocTitleColor:'#355386'
  },
  'rmb-5':{
    name:'永恒05',
    background:'#d5c0cf',
    titleBackground:'#2d1c4d',
    moreBackground:'#684e94',
    tocIndexColor:'#2d1c4d',
    tocTitleColor:'#2d1c4d'
  },
  'rmb-1':{
    name:'经典01',
    background:'#b0ce95',
    titleBackground:'#4d584c',
    moreBackground:'#6a855b',
    tocIndexColor:'#4d584c',
    tocTitleColor:'#4d584c'
  }
}

export default {
  data() {
    return {
      colorConfigs:colorConfigs,
      QRcodeSelect:{
        isFlie:false,
        file:[],
        data:'https://note.mowen.cn/note-intro/?noteUuid=VCM-EtZ94BrA5o4TBc1R3',
        message:'扫描二维码了解更多'
      },
      batchInput: {
        show:true,
        data:''
      },
      savedTocs:{
        show:false,
        data:[]
      },
      allConfigShow: false,
      currConfigTitle: '',
      courseTitle: '目录总览',  // 课程标题
      courseMore: '持续更新',  // 课程更多内容
      items: [
        { text: '童年：被遗弃与选择' },
        { text: '奇特的一对：两个史蒂夫' },
        { text: '出离：觉悟，修行...' },
        { text: '雅达利与印度：禅宗与游戏设计艺术' },
        { text: 'Apple I：开机，启动，接入' },
        { text: 'Apple II：新时代的曙光' },
        { text: '克里斯安和莉萨：被遗弃者...' },
        { text: '施乐和莉莎：图形用户界面' },
        { text: '上市：名利双收' },
        { text: 'Mac 诞生了：你说你想要一场革命' }
      ],  // 目录项列表
      image: '',  // 生成的图像
      color: 'pink',
      startNumberZero: false,
      tocSmallWidth: false,
      showQRCode: false
    };
  },
  created() {
    this.initData()
    if(this.batchInput.show){
      this.initBatchInputData()
    }
  },
  methods: {
    setValue(field, val) {
      this[field] = val;
      this.initBatchInputData()
      this.saveData()
    },
    setValue2(obj,field, val) {
      obj[field] = val;
      this.initBatchInputData()
      this.saveData()
    },
    showBatchInput(){
      this.batchInput.show = !this.batchInput.show
      // 初始化数据
      this.initBatchInputData()
    },
    initBatchInputData(){
      this.batchInput.data = this.items.map((x) => x.text).filter(x => x.trim().length !== 0).join("\n")
    },
    batchInputOk(){
      this.batchInput.show = false
      this.saveData()
    },
    batchInputItem(){
      const datas = this.batchInput.data.split("\n").filter(x => x.trim().length !== 0)
      // 新建
      if(this.items.length<datas.length) {
        const addRow = datas.length - this.items.length
        for(let i=0;i<addRow;i++){
          this.addItem() 
        }
      }else if(this.items.length>datas.length){
        const delRow = this.items.length - datas.length
        for(let i=0;i<delRow;i++){
          this.removeItem(this.items.length-1) 
        }
      }
      datas.forEach((v,index) => {
        this.items[index].text = v.replace(RegExp("^\\d+[、]+"),"")
      })
      this.saveData()
    },
    addItem() {
      this.items.push({ text: '' });
      this.saveData()
    },
    removeItem(index) {
      this.items.splice(index, 1);
      this.saveData()
    },
    clearItem() {
      this.courseTitle = '目录总览'
      this.courseMore = '持续更新'
      this.items.forEach(x => x.text = '')
      document.querySelector('.input-span').focus()
      this.saveData()
    },
    startNumber(index){
      const nIndex = this.startNumberZero?index:index + 1
      return nIndex >9?nIndex:'0' + nIndex
    },
    initData(){
      const dataStr = localStorage.getItem(localDataKey)
      if(dataStr){
        const data = JSON.parse(dataStr)
        this.setDataToCurr(data)
      }
      const savedTocsStr = localStorage.getItem(localSaveDataKey)
      if(savedTocsStr){
        this.savedTocs.data = JSON.parse(savedTocsStr)
      }
    },
    setDataToCurr(data){
        this.courseTitle = data.courseTitle
        this.courseMore = data.courseMore
        this.items = data.items
        this.color = data.color
        this.startNumberZero = data.startNumberZero
        this.tocSmallWidth = data.tocSmallWidth
        this.showQRCode = data.showQRCode
        if(data.QRcodeSelect){
          this.QRcodeSelect = data.QRcodeSelect
          if(typeof data.QRcodeSelect.file === 'string'){
            this.QRcodeSelect.file = [data.QRcodeSelect.file]
          }
        }
    },
    getCurrData(){
      const data = {
        courseTitle: this.courseTitle,
        courseMore: this.courseMore,
        items:this.items,
        color:this.color,
        startNumberZero:this.startNumberZero,
        tocSmallWidth:this.tocSmallWidth,
        showQRCode:this.showQRCode,
        QRcodeSelect: this.QRcodeSelect
      }
      return data
    },
    saveData(){
      const dataStr = JSON.stringify(this.getCurrData())
      localStorage.setItem(localDataKey,dataStr)
    },
    openSaveAs(){
      this.savedTocs.show = !this.savedTocs.show
    },
    saveAs(){
      if(this.savedTocs.data.length === 10){
        this.$message.warning('最多只能保存10个配置，查看已有配置进行删除')
        this.savedTocs.show = false
        return
      }
      if(this.currConfigTitle){
        if(this.savedTocs.data.find(x => x['configName'] === this.currConfigTitle)){
          this.$message.warning('配置名称已存在，请重新输入')
          return
        }
        this.savedTocs.show = false
        const data = JSON.parse(JSON.stringify(this.getCurrData()))
        data['configName'] = this.currConfigTitle
        this.savedTocs.data.push(data)
        this.saveTocsToLocal()
        this.$message.success('保存成功')
      }else{
        this.$message.warning('请输入配置名称')
      }
    },
    saveTocsToLocal(){
      const dataStr = JSON.stringify(this.savedTocs.data)
      localStorage.setItem(localSaveDataKey,dataStr)
    },
    showAllConfig(){
      this.allConfigShow = !this.allConfigShow
    },
    useThisConfig(data){
      this.setDataToCurr(data)
      this.initBatchInputData()
    },
    deleteThisConfig(index){
      this.savedTocs.data.splice(index,1)
      this.saveTocsToLocal()
      this.$message.warning('已删除')
    },
    showQRcodeChange(){
      console.log('showQRcodeChange')
    },
    beforeQRcodeUpload(file){
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图像不能大于 2MB!')
      }
      return isLt2M
    },
    QRcodeFileChange({ file,fileList }){
      console.log(file,fileList)
      if (file.status !== 'uploading') {
        this.getBase64(file.originFileObj, base64Url => {
          if(typeof this.QRcodeSelect.file === 'string'){
            this.QRcodeSelect.file = [this.QRcodeSelect.file]
          }
          // 保留最新的
          if(this.QRcodeSelect.file&&this.QRcodeSelect.file.length == 2){
            this.QRcodeSelect.file = this.QRcodeSelect.file.slice(1)
          }
          this.QRcodeSelect.file.push(base64Url)
          this.QRcodeSelect.isFlie = true
          this.saveData()
        });
      }
    },
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener('load', () => callback(reader.result));
      reader.readAsDataURL(img);
    },
    shareImage() {
      html2canvas(document.querySelector('#course-container'),{scale:3,dpi:350}).then(canvas => {
        const image = canvas.toDataURL('image/png');
        // You can now save the image or share it as you like
        this.image = image
        this.saveData()
      });
    },
    async dowloadImage(){
      const a = document.createElement('a');
      a.download = this.courseTitle+'.png';
      a.href = this.image;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }
};
</script>

<style>
#course-container {
  width: 100%;
  max-width: 430px;
  min-width: 375px;
  padding: 5px 2px;
  border-radius: 2px;
}
#course-container.toc-small{
  padding: 5px 25px;
}
.toc {
  padding: 10px;
  width: 95%;
  border-radius: 8px;
  margin-left: auto;
  margin-right: auto;
}
.title {
  color: #ffffff;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
  position: relative;
}

.item{
  background-color:#ffffff;
  margin-bottom: 5px;
}

.item>span.index{
  /* margin-right: 10px; */
  display: inline-block;
  width: 28px
}

.more{
  color: #ffffff;
  text-align: center;
  padding-top: 0px !important;
  margin-bottom: 15px;
  margin-top: 10px;
  position: relative;
}
span.left-line{
   position: absolute;
    height: 40%;
    border: 2px solid;
    border-radius: 2px;
    left: 8px;
    color: #ffffff;
}
span.right-line{
   position: absolute;
    height: 40%;
    border: 2px solid;
    border-radius: 2px;
    right: 8px;
    color: #ffffff;
}

span.left-bg{
   position: absolute;
   padding: 4px;
   background-color: #524e4f;
    border-radius: 50%;
    left: 6px;
}
span.right-bg{
   position: absolute;
   padding: 4px;
   background-color: #524e4f;
    border-radius: 50%;
    right: 6px;
}

.title>span.left-line,
.title>span.right-line{
    top: 85%;
}

.title>span.left-bg,
.title>span.right-bg{
    top: 83%;
}
.more>span.left-line,
.more>span.right-line{
    bottom: 85%;
}

.more>span.left-bg,
.more>span.right-bg{
    bottom: 83%;
}
.input-span{
  display: inline-block;
  min-width: 80%;
  max-width: 90%;
}
.input-span:focus{
  outline: none;
  border-bottom: 1px dashed #c2c2c2;
}
.footer{
  text-align: center;
  padding-top: 20px;
  padding-bottom: 60px;
  background-color: #e1d0d042;
}
.footer-center{
  width: 90%;
  margin: 5px 5%;
  text-align: center;
}
#options{
  background-color: #e1d0d042;
}
.qrcode{
  display: grid;
  place-items: center;
}
.qrcode img{
  margin: 0px 25px;
}

@media (min-width: 768px) {
  #options{
    
  }
}
</style>