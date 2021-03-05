<template>
  <div>
    <div>
      <language/>
      <div class="info-tab">
        <el-radio-group v-model="radioActive">
          <el-radio-button label="info">{{$t('messages.tab_info')}}</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="disk-container">
        <div class="disk-header">
          <div class="disk-img">
            <img src="~@/assets/disk.png"/>
          </div>
          <div class="disk-select">
            <p class="disk-name">{{diskInfo['_Device_/_Media_Name']}}</p>
            <p class="disk-space">{{diskSize}}</p>
          </div>
        </div>
        <disk-info :diskInfo="diskInfo"/>
      </div>
    </div>
    <footer-info/>
  </div>
</template>

<script>
import  FooterInfo from '@/components/Footer'
import  DiskInfo from '@/components/Info'
import  Language from '@/components/Language'

export default {
  data() {
    return {
      radioActive: 'info',
      diskInfo:[],
      diskName:'',
      diskSize:'',
      volumeFreeSpace:'',
    };
  },
  props: ['childInfo'],

  watch: {
    childInfo: {
      immediate: true,
      async handler(val) {
        this.diskInfo = val['disk_info'];
        var diskSizeArr = val['disk_info']['_Disk_Size'].split(' ');
        this.diskSize = diskSizeArr[0]+diskSizeArr[1];
      }
    }
  },
  components:{
    FooterInfo,
    DiskInfo,
    Language,
  },
}
</script>

<style>
.setting-btn {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 68px;
  right: 43px;
}
.el-badge__content.is-dot {
  height: 6px;
  width: 6px;
}
.language-btn {
  position: absolute;
  top: 68px;
  right: 87px;
}
.el-dropdown {
  font-size: 10px;
  cursor: pointer;
  color: #636670;
}
.el-dropdown-menu__item {
  font-size: 10px;
  color: #636670;
  line-height: 20px;
  padding: 0 10px;
}
.el-dropdown-menu__item:hover {
  color: #636670;
  background-color: #1C1F29;
}
.info-tab{
  margin-top: 32px;
  text-align: center;
}
.el-radio-group {
  background-color: #636366;
  border-radius: 7px;
  font-family: PingFang SC;
}
.el-radio-button__orig-radio:checked+.el-radio-button__inner {
  color: #EF4D23;
  background-color: #1C1F29;
  border-color: #636366;
  -webkit-box-shadow: 0 0 0 0 #8E8E93;
  box-shadow: 0 0 0 0 #8E8E93;
  font-weight: bold !important;
}
.el-radio-button__inner:hover {
  color: #FFFFFF;
  font-weight: 500;
}
.el-radio-button__inner {
  background-color: #636366;
  border: 2px solid #636366;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  color: #FFFFFF;
  padding: 0px;
  width: 115px;
  line-height: 28px;
}
.el-radio-button:last-child .el-radio-button__inner {
  border-radius: 7px;
  border-left: 1px solid #8E8E93;
}
.el-radio-button:first-child .el-radio-button__inner {
  border-radius: 7px;
  border-left: 2px solid #636366;
  border-right: 1px solid #8E8E93;
}
.disk-container {
  position: relative;
  top: 44px;
  left: 150px;
  width: 400px;
}
.disk-header {
  height: 60px;
  margin-bottom: 32px;
}
.disk-img {
  float: left;
  width: 60px;
}
.disk-select {
  float: left;
  padding-left: 12px;
  opacity: 1;
}
.disk-name{
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #12161F;
  line-height: 28px;
  margin: 4px 0;
}
.disk-space{
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #12161F;
  line-height: 18px;
  margin: 8px 0;
  color: #9B9EA8;
}

</style>