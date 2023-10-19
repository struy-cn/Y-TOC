<template>
  <div >
    <!-- 课程标题输入框 -->
    <a-input v-model:value="courseTitle" placeholder="请输入课程标题" />

    <!-- 目录项列表 -->
    <div v-for="(item, index) in items" :key="index">

      <!-- 目录项内容输入框 -->
      <a-input :addon-before="index + 1" v-model:value="item.text" placeholder="请输入目录项内容" >
        <template #suffix>
          <a-button @click="removeItem(index)">X</a-button>
        </template>
      </a-input>

      <!-- 删除目录项按钮 -->
    </div>
    <!-- 添加目录项按钮 -->
   <a-button @click="addItem">添加目录项</a-button>
  </div>
  <div>
    <div id="course-container">
      <div class="title">{{ courseTitle }}</div>
      <div class="item" v-for="(item, index) in items" :key="index">{{ index + 1 }}、{{ item.text }}</div>
    </div>
      <!-- 自定义颜色选择器 -->
  <input type="color" v-model="color" />

  <!-- 生成图像按钮 -->
  <a-button @click="generateImage">生成图像</a-button>

  <!-- 生成的图像 -->
  <img :width="200" :src="image" v-if="image" />

  <!-- 图像分享按钮 -->
  <a-button @click="shareImage" v-if="image">分享为图片</a-button>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';
export default {
  data() {
    return {
      courseTitle: 'XX读书会',  // 课程标题
      items: [
        { text: '第一章:课程介绍' },
        { text: '第二章:课程目标' },
        { text: '第三章:课程内容' },
        { text: '第四章:课程结尾' },
        { text: '第五章:课程总结' }
      ],  // 目录项列表
      color: '#000000',  // 颜色
      image: '',  // 生成的图像
      shareLink: ''  // 分享链接
    };
  },
  methods: {
    addItem() {
      this.items.push({ text: '' });
    },
    removeItem(index) {
      this.items.splice(index, 1);
    },
    generateImage() {
      // 生成图像的逻辑，略

      // 生成图像后更新图片链接
      this.image = '生成的图像链接';
    },
    shareImage() {
      // 分享图像的逻辑，略
      html2canvas(document.querySelector('#course-container')).then(canvas => {
        const image = canvas.toDataURL('image/png');
        // You can now save the image or share it as you like
        this.image = image
        console.log(image);
      });
      // 分享图像后更新分享链接
      this.shareLink = '分享的链接';
    }
  }
};
</script>

<style>
#course-container {
  height: 500px;
  background-color: antiquewhite;
  padding: 2px;
}
.title {
  padding: 10px;
  width: 80%;
  background-color: bisque;
  border-radius: 4px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: auto;
  margin-right: auto;
}

.item{
  padding: 10px;
  width: 80%;
  background-color:burlywood;
  border-radius: 4px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
}
</style>