<template>
  <div>
    <div v-if="image" style="width: 100%; height: 100%;">
      <!-- 生成的图像 -->
      <img  :src="image" style="width: 100%;" />
      <p style="text-align: center;">微信请长按分享或保存图片<br>浏览器请右键保存</p>
    </div>
    <div id="course-container" v-else>
      <div class="toc title" ><div contenteditable v-text="courseTitle" @blur="setValue('courseTitle', $event.target.innerHTML)"></div><span class="left-bg"></span><span class="right-bg"></span> <span class="left-line"></span><span class="right-line"></span></div>
      <div class="toc item" v-for="(item, index) in items" :key="index"><span class="index">{{ (index + 1) >9?(index + 1):'0' + (index + 1) }}</span><span contenteditable v-text="item.text" @blur="setValue2(item,'text', $event.target.innerHTML)"></span></div>
      <div class="toc more">......<br><div contenteditable v-text="courseMore" @blur="setValue('courseMore', $event.target.innerHTML)"></div><span class="left-line"></span><span class="right-line"></span></div>
    </div>
  <!-- 图像分享按钮 -->
  <p style="text-align: center;" v-if="!image">点击+添加目录项，点击-移除最后一项<br>所有内容可编辑，点击内容进行编辑</p>
  <a-button style="width: 90%;margin: 5px 5%;" @click="addItem" v-if="!image">+</a-button>
  <a-button style="width: 90%;margin: 5px 5%;" @click="removeItem(items.length - 1)" v-if="!image">-</a-button>
  <a-button type="primary" style="width: 90%;margin: 5px 5%;" @click="shareImage" v-if="!image">图片预览</a-button>
  <a-button type="primary" style="width: 90%;margin: 5px 5%;" @click="()=> image = ''" v-if="image">返回编辑</a-button>
  <div style="margin-top: 40px;"></div>
  </div>
  <div class="footer">
    <p>© 2023｜<a href="https://struy.cn/">StruggleYang</a></p>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
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
    };
  },
  methods: {
    setValue(field, val) {
      this[field] = val;
    },
    setValue2(obj,field, val) {
      obj[field] = val;
    },
    addItem() {
      this.items.push({ text: '' });
    },
    removeItem(index) {
      this.items.splice(index, 1);
    },
    shareImage() {
      // 分享图像的逻辑，略
      html2canvas(document.querySelector('#course-container')).then(canvas => {
        const image = canvas.toDataURL('image/png');
        // You can now save the image or share it as you like
        this.image = image
        console.log(image);
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
  background-color: #f5e5eb;
  padding: 2px;
  border-radius: 2px;
}
.item-input{
  margin-top: 10px;
}
.more-input{
  margin-top: 10px;
}
.toc {
  padding: 10px;
  width: 95%;
  border-radius: 8px;
  margin-left: auto;
  margin-right: auto;
}
.title {
  background-color: #71403f;
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
  color: #412A2D;
  margin-bottom: 5px;
}

.item>span.index{
  color: #963e5b !important;
  margin-right: 10px;
}

.more{
  background-color: #c48080;
  color: #ffffff;
  text-align: center;
  padding-top: 0px !important;
  margin-bottom: 15px;
  margin-top: 10px;
  position: relative;
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
   background-color: #5a1e35;
    border-radius: 50%;
    left: 6px;
    top: 83%;
}
.title>span.right-bg{
   position: absolute;
   padding: 4px;
   background-color: #5a1e35;
    border-radius: 50%;
    right: 6px;
    top: 83%;
}
.footer{
  text-align: center;
  margin-bottom: 20px;
}
</style>