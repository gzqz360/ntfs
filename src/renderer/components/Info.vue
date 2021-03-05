<template>
  <div class="disk-info">
    <p>{{$t('messages.info_file_system')}}{{diskData['_Name_(User_Visible)']}}</p>
    <p>{{$t('messages.info_device_identifier')}}{{diskData['_Device_Identifier']}}</p>
    <p>{{$t('messages.info_whole')}}{{diskData['_Whole']}}</p>
    <p>{{$t('messages.info_removable_media')}}{{diskData['_Removable_Media']}}</p>
    <p>{{$t('messages.info_only_read')}}{{diskData['_Read-Only_Volume']}}</p>
    <p>{{$t('messages.info_device_block_size')}}{{diskData['_Device_Block_Size']}}</p>
  </div>
</template>

<script>
export default {
  name:'info',
  data() {
    return {
      diskData:[],
    };
  },
  props: ['diskInfo'],

  watch: {
    diskInfo:{
      immediate: true,
      async handler(val) {
        this.diskData = val
      }
    }
  }
}
</script>

<style>
.disk-info > p{
  margin: 12px 0;
  font-family: PingFang SC;
  font-size: 16px;
  color: #636670;

}
</style>