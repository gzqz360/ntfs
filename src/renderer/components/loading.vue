<template>
  <modal v-if="show">
    <div class="container1">
      <div class="circle circle1 red"></div>
      <div class="circle circle2 yellow"></div>
      <div class="circle circle3 green"></div>
      <div class="circle circle4 blue"></div>
    </div>
    <div class="container2">
      <div class="circle circle1 purper"></div>
      <div class="circle circle2 grey"></div>
      <div class="circle circle3 pink"></div>
      <div class="circle circle4 orange"></div>
    </div>
    <div class="tipView">加载中...</div>
  </modal>
</template>

<script>
import Modal from "./modal";
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Modal
  }
};
</script>

<style scoped>
.tipView {
  font-size: 10px;
  left: 50%;
  top: 50%;
  margin-top: 7px;
  transform: translate(-50%, 50%);
  display: inline-block;
  height: 100px;
  position: absolute;
}
.container1,
.container2 {
  width: 40px;
  height: 40px;
  /* border: 1px solid red; */
  position: absolute;
  top: 50%;
  left: 50%;

  margin-left: -20px;
}
.container2 {
  transform: rotateZ(45deg);
}
.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #000;
  position: absolute;
  animation: loadding 1.2s both infinite;
}

.circle1 {
  left: 0;
  top: 0;
}
.circle2 {
  right: 0;
  top: 0;
}
.circle3 {
  right: 0;
  bottom: 0;
}
.circle4 {
  left: 0;
  bottom: 0;
}
.container1 .circle1 {
  animation-delay: 0s;
}
.container2 .circle1 {
  animation-delay: 0.2s;
}
.container1 .circle2 {
  animation-delay: 0.3s;
}
.container2 .circle2 {
  animation-delay: 0.4s;
}
.container1 .circle3 {
  animation-delay: 0.5s;
}
.container2 .circle3 {
  animation-delay: 0.6s;
}
.container1 .circle4 {
  animation-delay: 0.7s;
}
.container2 .circle4 {
  animation-delay: 0.8s;
}
@keyframes loadding {
  0% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
  80% {
    transform: scale(0);
  }
  100% {
    transform: scale(0);
  }
}
.red {
  background-color: red;
}
.yellow {
  background-color: yellow;
}
.green {
  background-color: green;
}
.blue {
  background-color: blue;
}
.purper {
  background-color: purple;
}
.grey {
  background-color: grey;
}
.pink {
  background-color: pink;
}
.orange {
  background-color: orange;
}
</style>