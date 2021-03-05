<template>
  <div>
    <div>
      <language/>
      <div class="info-tab">
        <el-radio-group v-model="radioActive" @change="radioChange">
          <el-radio-button label="info">{{$t('messages.tab_info')}}</el-radio-button>
          <el-radio-button label="format" v-if="diskInfo['_Partition_Type'] != undefined &&
             diskInfo['_Partition_Type'] != 'Apple_APFS'">{{$t('messages.tab_format')}}</el-radio-button>
          <el-radio-button label="repair" v-if="diskInfo['_Type_(Bundle)'] != undefined &&
             diskInfo['_Type_(Bundle)'] == 'ntfs'">{{$t('messages.tab_repair')}}</el-radio-button>
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
            <p class="disk-name">{{diskName}}</p>
            <p class="disk-space">{{volumeFreeSpace}}/{{diskSize}} {{$t('messages.available_space')}}</p>
          </div>
        </div>
        <template v-if="diskInfoActive == true">
          <disk-info :diskInfo="diskInfo"/>
        </template>
        <template v-if="diskFormatActive == true">
          <disk-format :diskInfo="diskInfo" @refreshDiskList="refreshDiskList"/>
        </template>
        <template v-if="diskRepairActive == true">
          <disk-repair :diskInfo="diskInfo" @refreshDiskList="refreshDiskList"/>
        </template>
      </div>
    </div>
    <footer-info/>
  </div>
</template>

<script>
import  FooterInfo from '@/components/Footer'
import  DiskInfo from '@/components/Info'
import  DiskFormat from '@/components/Format'
import  DiskRepair from '@/components/Repair'
import  Language from '@/components/Language'

export default {
  data() {
    return {
      radioActive: 'info',
      diskInfoActive: true,
      diskFormatActive: false,
      diskRepairActive: false,
      diskInfo:[],
      diskPath:'',
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
        this.diskPath = val['disk_path']
        if(val['disk_info']['_Volume_Free_Space'] != undefined) {
          var volumeFreeSpaceArr = val['disk_info']['_Volume_Free_Space'].split(' ');
          this.volumeFreeSpace = volumeFreeSpaceArr[0]+volumeFreeSpaceArr[1];
        }else{
          this.volumeFreeSpace = this.$t('messages.undefined');
        }
        var diskSizeArr = val['disk_info']['_Disk_Size'].split(' ');
        this.diskSize = diskSizeArr[0]+diskSizeArr[1];
        if(val['disk_info']['_Volume_Name'] != '' && val['disk_info']['_Volume_Name'] != 'Not applicable (no file system)'){
          this.diskName = val['disk_info']['_Volume_Name'];
        }else{
          this.diskName = val['disk_info']['_Partition_Type'];
        }
      }
    }
  },
  components:{
    FooterInfo,
    DiskInfo,
    DiskFormat,
    DiskRepair,
    Language,
  },
  methods: {
    radioChange: function (label) {
      if(label=='info'){
        this.diskInfoActive=true;
        this.diskFormatActive=false;
        this.diskRepairActive=false;
      }else if(label=='format'){
        this.diskInfoActive=false;
        this.diskFormatActive=true;
        this.diskRepairActive=false;
      }else{
        this.diskInfoActive=false;
        this.diskFormatActive=false;
        this.diskRepairActive=true;
      }
    },
    refreshDiskList:function (list) {
      this.$emit('refreshDiskList',list)
    }
  }
}
</script>

<style>
.info-tab{
  margin-top: 32px;
  text-align: center;
}
.el-radio-group {
  background-color: #636366;
  border-radius: 7px;
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
  color: #EF4D23;
  font-weight: bold;
}
.el-radio-button__inner {
  background-color: #636366;
  border: 2px solid #636366;
  border-radius: 7px;
  font-size: 13px;
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
  width: 380px;
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