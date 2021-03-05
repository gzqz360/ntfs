<template>
    <div class="disk-format">
      <div class="disk-format-select">
        <p>{{$t('messages.format_target')}}</p>
        <div class="select-div">
          <div class="el-select" @click="openValue">
            <input v-model="label" type="text" placeholder="">
            <img :src="show == true ? foldIcon : unfoldIcon">
          </div>
          <div class="select-list" v-show="show">
            <ul>
<!--              <li @click="getvalue(item.label,item.value)" v-for="(item,index) in formatTypeList" :key="item.index">{{ item.label }}</li>-->
              <li @click="getvalue($t('messages.ntfs_label'),$t('messages.ntfs_value'))">{{$t('messages.ntfs_label')}}</li>
              <li @click="getvalue($t('messages.apfs_label'),$t('messages.apfs_value'))">{{$t('messages.apfs_label')}}</li>
              <li @click="getvalue($t('messages.ex_fat_label'),$t('messages.ex_fat_value'))">{{$t('messages.ex_fat_label')}}</li>
              <li @click="getvalue($t('messages.journaled_hfs_label'),$t('messages.journaled_hfs_value'))">{{$t('messages.journaled_hfs_label')}}</li>
              <li @click="getvalue($t('messages.case_sensitive_hfs_label'),$t('messages.case_sensitive_hfs_value'))">{{$t('messages.case_sensitive_hfs_label')}}</li>
              <li @click="getvalue($t('messages.case_sensitive_journaled_hfs_label'),$t('messages.case_sensitive_journaled_hfs_value'))">{{$t('messages.case_sensitive_journaled_hfs_label')}}</li>
              <li @click="getvalue($t('messages.fat_label'),$t('messages.fat_value'))">{{$t('messages.fat_label')}}</li>
            </ul>
          </div>
        </div>
        </div>
      <div  class="disk-format-file">
        <p>{{$t('messages.format_file_name')}}</p>
        <div class="file-name-div">
          <el-input size="mini" v-model="fileName"></el-input>
        </div>
      </div>
      <div class="disk-format-btn">
      <el-button  class="format-btn" size="small" @click="formatDisk()" v-if="formatStatus ==0">{{$t('messages.format_btn')}}</el-button>
      <el-button  class="format-btn formatting" size="small" :loading="true" v-if="formatStatus ==1">{{$t('messages.formatting')}}</el-button>
      </div>
    </div>
</template>

<script>
import foldIcon from "../assets/fold.png";
import unfoldIcon from "../assets/unfold.png";
import {getDiskList,formatDisk} from '@/utils/utils'
const storage = require('electron-localstorage');
export default {
  name:'format',
  data() {
    return {
      formatTypeList: [{
        value: this.$t('messages.ntfs_value'),
        label: this.$t('messages.ntfs_label')
      },{
        value: this.$t('messages.apfs_value'),
        label: this.$t('messages.apfs_label')
      }, {
        value: this.$t('messages.ex_fat_value'),
        label: this.$t('messages.ex_fat_label')
      }, {
        value: this.$t('messages.journaled_hfs_value'),
        label: this.$t('messages.journaled_hfs_label')
      }, {
        value: this.$t('messages.case_sensitive_hfs_value'),
        label: this.$t('messages.case_sensitive_hfs_label')
      },{
        value: this.$t('messages.case_sensitive_journaled_hfs_value'),
        label: this.$t('messages.case_sensitive_journaled_hfs_label')
      },{
        value: this.$t('messages.fat_value'),
        label: this.$t('messages.fat_label')
      }],
      value:'',
      label:'',
      show:false,
      foldIcon:foldIcon,
      unfoldIcon:unfoldIcon,
      fileName:'',
      diskData:[],
      diskList:[],
      formatStatus: 0,
    }
  },
  props: ['diskInfo'],

  watch: {
    diskInfo:{
      immediate: true,
      async handler(val) {
        this.diskData = val
        var key = this.diskData['_Device_Identifier']
        if(storage.getItem('formatStatus_'+key) != undefined && storage.getItem('formatStatus_'+key) == 1){
          this.formatStatus = 1
        }else{
          this.formatStatus = 0
        }
      }
    }
  },
  methods: {
    openValue(){
      this.show=!this.show;
    },
    getvalue(label,value){
      this.label=label;
      this.value=value;
      this.show=false;
    },
    getDiskList(){
      getDiskList().then((res) => {
        this.$emit('refreshDiskList',JSON.parse(JSON.stringify(res)));
      }).catch((e)=>{
        this.$emit('refreshDiskList',[]);
      })
    },
    formatDisk(){
      var diskPath = this.diskData['_Device_Node']
      var mounted = this.diskData['_Mounted']
      var formatTarget = this.value
      var fileName = this.fileName
      if(!formatTarget){
        this.$message(this.$t('messages.format_target_tip'));
        return false
      }
      if(!fileName){
        this.$message(this.$t('messages.format_file_name_tip'));
        return false
      }
      var key = this.diskData['_Device_Identifier']
      storage.setItem('formatStatus_'+key, 1)
      this.formatStatus = 1
      formatDisk(diskPath,mounted,formatTarget,fileName).then(() => {
        this.label = ''
        this.fileName = ''
        this.getDiskList();
        storage.setItem('formatStatus_'+key, 0)
        if(this.diskData['_Device_Identifier'] == key) {
          this.formatStatus = 0
        }
        this.$message(this.$t('messages.format_success'));
      }).catch((e) => {
        console.log(e)
        storage.setItem('formatStatus_'+key, 0)
        if(this.diskData['_Device_Identifier'] == key) {
          this.formatStatus = 0
        }
        this.$message(this.$t('messages.format_failed'));
      })
    },
  }
}
</script>


<style>
.disk-format-select p,.disk-format-file p{
  float: left;
  color: #636670;
  font-size: 16px;
  line-height: 32px;
  margin: 0;
}
.select-div{
  width: 260px;
  height: 32px;
  float: left;
  margin-left: 8px;
  margin-bottom: 16px;
}
.file-name-div{
  width: 260px;
  height: 32px;
  float: left;
  margin-left: 8px;
  margin-bottom: 64px;
}
.el-select{
  width: 250px;
  height: 32px;
  line-height: 32px;
  padding-left: 10px;
  background: white;
  border-radius: 4px;
  position: relative;
}
.el-select input{
  border: none;
  outline: none;
  width: 90%;
  font-family: PingFang SC;
  color: #636670;
}
.el-select img{
  position: absolute;
  right: 12px;
  top: 40%;
}
.select-list{
  width: 258px;
  position:absolute;
  z-index:999;
  background: white;
  border: 1px solid #f5f7fa;
  overflow: hidden;
  font-family: PingFang SC;
  font-size: 14px;
  color: #636670;
}
.select-list ul{
  padding-left: 0;
  margin: 0;
}
.select-list ul li{
  width: 100%;
  height: 32px;
  cursor: pointer;
  line-height: 32px;
  padding-left: 10px;
  z-index:999;
  list-style: none;
}
.select-list ul li:hover{
  background-color: #f5f7fa;
}
.el-input {
  width: 260px;
  height: 32px;
  margin-bottom: 48px;
}
.el-input--mini .el-input__inner {
  height: 32px;
  line-height: 32px;
  border: 0px;
}
.disk-format-btn{
  margin-right: 40px;
}
.format-btn {
  width: 159px;
  height: 32px;
  background-color: #EF4D23;
  outline:none;
  opacity: 1;
  border-radius: 8px;
  font-size: 13px;
  line-height: 15px;
  color: #F5F6FA;
  display:block;
  margin:0 auto;
  border: 0;

}
.format-btn:focus, .format-btn:hover {
  color: #F5F6FA;
  border: 1px solid #EF4D23;
  background-color: #EF4D23;
}
.formatting{
  border: 1px solid #ffffff;
  background-color: #ffffff;
  color: #9B9EA8;
}
.formatting:focus, .formatting:hover {
  border: 1px solid #ffffff;
  background-color: #ffffff;
  color: #9B9EA8;
}
</style>