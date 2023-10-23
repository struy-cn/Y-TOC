<template>
  <div>
    <div v-if="image" style="width: 100%; height: 100%;">
      <!-- 生成的图像 -->
      <img  :src="image" style="width: 100%;" />
      <p style="text-align: center;background-color: #e1d0d042;">微信请长按分享或保存图片<br>浏览器请右键保存(电脑会更清晰)</p>
    </div>
    <div id="course-container" :class="color" v-else>
      <div class="toc title" ><div  contenteditable v-text="courseTitle" @blur="setValue('courseTitle', $event.target.innerHTML)"></div><span class="left-bg"></span><span class="right-bg"></span> <span class="left-line"></span><span class="right-line"></span></div>
      <div class="toc item" v-for="(item, index) in items" :key="index"><span class="index">{{ startNumber(index) }}</span><span class="input-span" contenteditable v-text="item.text" @blur="setValue2(item,'text', $event.target.innerHTML)"></span></div>
      <div class="toc more">......<br><div contenteditable v-text="courseMore" @blur="setValue('courseMore', $event.target.innerHTML)"></div><span class="left-bg"></span><span class="right-bg"></span><span class="left-line"></span><span class="right-line"></span></div>
    </div>
    <div id="options">
      <div v-if="!image">
        <a-row>
          <a-col :span="8">
            <a-button class="footer-center"  @click="clearItem()" >清空内容</a-button>
          </a-col>
          <a-col :span="8">
            <a-button class="footer-center"  @click="removeItem(items.length - 1)" >-</a-button>
          </a-col>
          <a-col :span="8">
            <a-button class="footer-center"  @click="addItem">+</a-button>
          </a-col>
        </a-row>
        <p style="text-align: center;">点击+添加目录项，点击-移除最后一项<br>所有内容可编辑，点击内容进行编辑<br>所有内容、选项保存至本地</p>
        <div class="footer-center">
          <a-radio-group style="width: 100%;" v-model:value="color" @change="saveData">
            <a-radio-button style="background-color: #f5e5eb;" value="pink">&nbsp;粉&nbsp;</a-radio-button>
            <a-radio-button style="background-color: #d9f7be;" value="green">&nbsp;绿&nbsp;</a-radio-button>
            <a-radio-button style="background-color: #e6f4ff;" value="bule">&nbsp;蓝&nbsp;</a-radio-button>
            <a-radio-button style="background-color: #ffccc7;" value="red">&nbsp;红&nbsp;</a-radio-button>
            <a-radio-button style="background-color: #fff1b8;" value="golden">&nbsp;金&nbsp;</a-radio-button>
          </a-radio-group>
        </div>
        <a-row>
          <a-col :span="24" style="text-align: center;">
            <a-checkbox  v-model:checked="startNumberZero" @change="saveData" >序号从0开始</a-checkbox>
          </a-col>
        </a-row>
        <a-button class="footer-center"  @click="shareImage">图片预览</a-button>
      </div>
      <a-button class="footer-center" v-else  @click="()=> image = ''">返回编辑</a-button>
    </div>
  <div class="footer">
    <p><a href="https://struy.cn/">StruggleYang</a>© 2023｜<a href="https://note.mowen.cn/note-intro/?noteUuid=VCM-EtZ94BrA5o4TBc1R3">打赏作者￥</a></p>
  </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

const localDataKey = "localMasterData"

export default {
  data() {
    return {
      courseTitle: '目录总览',  // 课程标题
      courseMore: '持续更新，共计42章',  // 课程更多内容
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
      startNumberZero: false
    };
  },
  created() {
    this.initData()
  },
  methods: {
    setValue(field, val) {
      this[field] = val;
      this.saveData()
    },
    setValue2(obj,field, val) {
      obj[field] = val;
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
      this.courseTitle = '标题'
      this.courseMore = 'more'
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
        this.courseTitle = data.courseTitle
        this.courseMore = data.courseMore
        this.items = data.items
        this.color = data.color
        this.startNumberZero = data.startNumberZero
      }
    },
    saveData(){
      const data = {
        courseTitle: this.courseTitle,
        courseMore: this.courseMore,
        items:this.items,
        color:this.color,
        startNumberZero:this.startNumberZero
      }
      const dataStr = JSON.stringify(data)
      localStorage.setItem(localDataKey,dataStr)
    },
    shareImage() {
      html2canvas(document.querySelector('#course-container'),{scale:3,dpi:350}).then(canvas => {
        const image = canvas.toDataURL('image/png');
        // You can now save the image or share it as you like
        this.image = image
        this.saveData()
      });
    }
  }
};
</script>

<style>
#course-container {
  width: 100%;
  max-width: 430px;
  min-width: 375px;
  padding: 2px;
  border-radius: 2px;
}
#course-container.pink{
  background-color: #f5e5eb;
}
#course-container.green{
  background-color: #d9f7be;
}
#course-container.bule{
  background-color: #e6f4ff;
}
#course-container.red{
  background-color: #ffccc7;
}
#course-container.golden{
  background-color: #fff1b8;
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
#course-container.pink>.title{
  background-color: #71403f;
}
#course-container.green>.title{
  background-color: #5d864b;
}
#course-container.bule>.title{
  background-color: #5c78a5;
}
#course-container.red>.title{
  background-color: #8f282d;
}
#course-container.golden>.title{
  background-color: #9e7020;
}

.item{
  background-color:#ffffff;
  margin-bottom: 5px;
}

#course-container.pink>.item{
  color: #412A2D;
}
#course-container.green>.item{
  color: #48633c;
}
#course-container.bule>.item{
  color: #40516d;
}
#course-container.red>.item{
  color: #5a1a1d;
}
#course-container.golden>.item{
  color: #664815;
}

.item>span.index{
  margin-right: 10px;
}

#course-container.pink>.item>span.index{
  color: #963e5b !important;
}
#course-container.green>.item>span.index{
  color: #2c6912 !important;
}
#course-container.bule>.item>span.index{
  color: #1349a0 !important;
}
#course-container.red>.item>span.index{
  color: #8d050c !important;
}
#course-container.golden>.item>span.index{
  color: #ac7414 !important;
}

.more{
  color: #ffffff;
  text-align: center;
  padding-top: 0px !important;
  margin-bottom: 15px;
  margin-top: 10px;
  position: relative;
}
#course-container.pink>.more{
  background-color: #c48080;
}
#course-container.green>.more{
  background-color: #8cc972;
}
#course-container.bule>.more{
  background-color: #8eb0e5;
}
#course-container.red>.more{
  background-color: #db787d;
}
#course-container.golden>.more{
  background-color: #f1c475;
  color: #664815;
}

.more>span.left-line{
   position: absolute;
    height: 40%;
    border: 2px solid;
    border-radius: 2px;
    left: 8px;
    bottom: 85%;
}
.more>span.right-line{
   position: absolute;
    height: 40%;
    border: 2px solid;
    border-radius: 2px;
    right: 8px;
    bottom: 85%;
}

.more>span.left-bg{
   position: absolute;
   padding: 4px;
   background-color: #524e4f;
    border-radius: 50%;
    left: 6px;
    bottom: 83%;
}
.more>span.right-bg{
   position: absolute;
   padding: 4px;
   background-color: #524e4f;
    border-radius: 50%;
    right: 6px;
    bottom: 83%;
}

.title>span.left-line{
   position: absolute;
    height: 40%;
    border: 2px solid;
    border-radius: 2px;
    left: 8px;
    top: 85%;
}
.title>span.right-line{
   position: absolute;
    height: 40%;
    border: 2px solid;
    border-radius: 2px;
    right: 8px;
    top: 85%;
}

.title>span.left-bg{
   position: absolute;
   padding: 4px;
   background-color: #524e4f;
    border-radius: 50%;
    left: 6px;
    top: 83%;
}
.title>span.right-bg{
   position: absolute;
   padding: 4px;
   background-color: #524e4f;
    border-radius: 50%;
    right: 6px;
    top: 83%;
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
</style>