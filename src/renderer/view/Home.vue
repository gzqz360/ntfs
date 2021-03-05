<template>
  <div>
    <language/>
    <div class="disk-content">
      <div class="disk-head">
      <div class="disk-img">
        <img src="~@/assets/disk.png"/>
      </div>
      <div class="disk-select">
        <p>{{$t('messages.please_select_disk')}}</p>
      </div>
      </div>
      <div class="disk-info">
        <p>{{$t('messages.info_file_system')}}</p>
        <p>{{$t('messages.info_device_identifier')}}</p>
        <p>{{$t('messages.info_whole')}}</p>
        <p>{{$t('messages.info_removable_media')}}</p>
        <p>{{$t('messages.info_only_read')}}</p>
        <p>{{$t('messages.info_device_block_size')}}</p>
      </div>
    </div>
    <footer-info/>
  </div>
</template>

<script>
import  FooterInfo from '@/components/Footer'
import  Language from '@/components/Language'
export default {
  components:{
    FooterInfo,
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
.disk-content {
  position: relative;
  top: 80px;
  left: 150px;
  width: 400px;
}
.disk-head{
  height: 60px;
  margin-bottom: 24px;
}
.disk-img{
  float: left;
  width: 60px;
}
.disk-select{
  float: left;
  padding-left: 12px;
  font-size: 20px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #12161F;
  opacity: 1;
}
.disk-info > p{
  margin: 12px 0;
  font-family: PingFang SC;
  font-size: 16px;
  color: #636670;

}
</style>