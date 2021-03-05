<template>
  <el-container>
    <el-aside>
      <div class="logo">
        <div class="logo-img">
          <img src="~@/assets/logo.png" width="33px"/>
        </div>
        <div class="logo-name">
          <p>QZ NTFS</p>
        </div>
      </div>
      <el-menu
          class="el-menu-vertical-demo"
          background-color="#1C1F29"
          text-color="#CFD3E0"
          ref="menu"
          unique-opened
          active-text-color="#EF4D23"
          @open="handleOpen"
          @close="handleClose"
          >
        <el-submenu v-for="(item,index) in diskList" ref="subMenu" :index="JSON.stringify(index)">
          <template slot="title">
              <img class ="icon-img" src="~@/assets/disk-icon.png":src="subMenuIndex == JSON.stringify(index) ? diskActiveIcon : diskIcon"/>
            <span :class="{el_submenu_span_active:subMenuIndex == JSON.stringify(index)}">{{item.disk_info['_Device_/_Media_Name'] | ellipsis}}</span>
          </template>
          <el-menu-item v-for="(item_child,index_child) in item.disk_child"
                        :index="JSON.stringify(index)+'-'+JSON.stringify(index_child)">
            <router-link class="router-link" to="/index">
              <div :index="JSON.stringify(index)+'-'+JSON.stringify(index_child)" class ="el-menu-item-info"
                   :class="{active:itemCurrentIndex === JSON.stringify(index)+'-'+JSON.stringify(index_child)}"
                   @click="elItemClick(JSON.stringify(index)+'-'+JSON.stringify(index_child))">
                <img class ="icon-disk-img" :src="itemCurrentIndex == JSON.stringify(index)+'-'+JSON.stringify(index_child)
                ? diskOnIcon : diskOffIcon" />
                <template v-if="item_child.disk_info._Volume_Name != '' &&
                item_child.disk_info._Volume_Name != 'Not applicable (no file system)'">{{item_child.disk_info._Volume_Name| ellipsis}}</template>
                <template v-else>{{item_child.disk_info._Partition_Type | ellipsis}}</template>
              </div>
            </router-link>
            <el-button round class="mount-btn" v-if="selfMountValue != 1 && item_child.disk_info['_Type_(Bundle)'] != undefined &&
             item_child.disk_info['_Type_(Bundle)'] == 'ntfs' && item_child.disk_info['_Mounted'] == 'No'"
             @click="mountDisk(item_child['disk_info']['_Device_Node'],item_child['disk_info']['_Volume_Name'],JSON.stringify(index)+'-'+JSON.stringify(index_child))">
              {{$t('messages.mount')}}</el-button>
            <el-button round class="umount-btn" v-if="selfMountValue != 1 && item_child.disk_info['_Type_(Bundle)'] != undefined
            && item_child.disk_info['_Type_(Bundle)'] == 'ntfs' && item_child.disk_info['_Mounted'] == 'Yes'"
            @click="umountDisk(item_child['disk_info']['_Device_Node'],JSON.stringify(index)+'-'+JSON.stringify(index_child))">
              {{$t('messages.umount')}}</el-button>
          </el-menu-item>
        </el-submenu>
      </el-menu>
      <el-button round class="eject-btn" :class="{hide:btnHideIndex === true}" @click="ejectDisk(ejectIndex)">
        <img class ="eject-img" src="~@/assets/eject.png"/>
        <div class ="eject-span">{{$t('messages.eject')}}</div>
      </el-button>
    </el-aside>
    <el-main>
      <router-view :childInfo="childInfo" @refreshDiskList="refreshDiskList" @settingSelfMount="settingSelfMount"/>
    </el-main>
  </el-container>
</template>

<script>
import diskIcon from "../assets/disk-icon.png";
import diskActiveIcon from "../assets/disk-icon-active.png";
import diskOffIcon from "../assets/disk-off.png";
import diskOnIcon from "../assets/disk-on.png";
import {checkPwd,checkNtfs,getDiskList,ejectDisk,mountDisk,umountDisk} from '@/utils/utils'
import config from '../../../package.json'

export default {
  data(){
    return {
      selfMountValue:localStorage.selfMountValue,
      subMenuIndex:-1,
      itemCurrentIndex:0,
      diskIcon:diskIcon,
      diskActiveIcon:diskActiveIcon,
      diskOffIcon:diskOffIcon,
      diskOnIcon:diskOnIcon,
      btnHideIndex:true,
      diskList: {},
      ejectIndex:'',
      childInfo: [],
    }
  },
  mounted(){
    checkNtfs().then(() => {
      this.getVersion();
      this.getList();
    })
  },
  methods: {
    elItemClick(index) {
      this.itemCurrentIndex=index;
      var keyArr = index.split('-');
      var parentKey = keyArr[0];
      var childKey = keyArr[1];
      console.log(this.diskList)
      this.childInfo=this.diskList[parentKey]['disk_child'][childKey];
    },
    getList(){
      getDiskList().then((res) => {
        this.diskList = JSON.parse(JSON.stringify(res));
        console.log(this.diskList)
      }).then(() => {
        setTimeout(() =>{
          this.getList();
        },2000);
      }).catch((e)=>{
        this.diskList=[];
        this.getList();
      })
    },
    getDiskList(index=''){
      getDiskList().then((res) => {
        this.diskList = JSON.parse(JSON.stringify(res));
        if(index && index==this.itemCurrentIndex){
          this.elItemClick(index);
        }
      }).catch((e)=>{
        this.diskList=[];
      })
    },
    ejectDisk(path){
      ejectDisk(path).then(() => {
        this.$refs.menu.close(this.subMenuIndex);
        this.$router.push('/home');
        this.childInfo=[];
        this.itemCurrentIndex=0;
        this.ejectIndex = '';
        this.btnHideIndex= true;
        this.subMenuIndex = -1;
        this.$message(this.$t('messages.eject_success'));
      }).catch((e)=>{
        this.$message(this.$t('messages.eject_failed'));
      })
    },
    mountDisk(diskPath,volumeName,index){
      mountDisk(diskPath,volumeName).then(() => {
        this.getDiskList(index);
        this.$message(this.$t('messages.mount_success'));
      }).catch((e) => {
        this.$message(this.$t('messages.mount_failed'));
      })
    },
    umountDisk(diskPath,index){
      umountDisk(diskPath).then(() => {
        this.getDiskList(index);
        this.$message(this.$t('messages.umount_success'));
      }).catch((e) => {
        this.$message(this.$t('messages.umount_failed'));
      })
    },
    handleOpen(key) {
      this.subMenuIndex = key;
      this.itemCurrentIndex=0;
      this.$router.push('/disk');
      this.childInfo=this.diskList[key];
      var diskPath = this.diskList[key]['disk_path'];
      var diskType = this.diskList[key]['disk_info']['_Protocol'];
      if(diskType == 'USB') {
        this.ejectIndex = diskPath;
        this.btnHideIndex = false;
      }else{
        this.ejectIndex = '';
        this.btnHideIndex = true;
      }
    },
    handleClose(key) {
      this.$router.push('/disk');
      this.childInfo=this.diskList[key];
      this.ejectIndex = '';
      this.btnHideIndex= true;
      this.itemCurrentIndex=0;
    },
    refreshDiskList:function (list) {
      this.diskList = list;
      this.elItemClick(this.itemCurrentIndex);
    },
    settingSelfMount:function (selfMountValue) {
      this.selfMountValue = selfMountValue;
    },

    async getVersion(){
      await this.$http.get('https://gitlab.gzqz.work/ntfs/client-api/raw/master/api.json',{
        params:{},
      }).then(resp => {
        if(config.versionCode !== resp.data.version_code){
          if(resp.data.force_update ==1){
            var tip = this.$t('messages.version_new_found')+resp.data.version_name+','+this.$t('messages.please_update_now')
            this.$alert(tip,this.$t('messages.tip'), {
              confirmButtonText: this.$t('messages.update_now'),
              showClose:false,
            }).then(({value}) => {
              const { shell } = require('electron');
              shell.openExternal(resp.data.version_url)
              this.getVersion();
            })
          }else{
            var tip = this.$t('messages.version_new_found')+resp.data.version_name+','+this.$t('messages.is_update_now')
            this.$confirm(tip,this.$t('messages.tip'), {
              confirmButtonText: this.$t('messages.update_now'),
              cancelButtonText: this.$t('messages.cancel'),
              showClose:false,
            }).then(({value}) => {
              const { shell } = require('electron');
              shell.openExternal(resp.data.version_url)
            }).catch((e) => {
              console.log(e);
            });
          }
        }
      })
    }
  },
  filters:{
    ellipsis(value){
      if(!value) return '';
      if(value.length > 16){
        return value.slice(0,13)+'...'
      }
      return value;
    }
  }
}

</script>

<style>
body{
  margin: 0;
  font-family: PingFang SC;
}
.el-aside{
  overflow: hidden;
  width: 20% !important;
  position:relative;
}
.el-main {
  background: #F8F8FA;
  margin: 10px;
  border-radius: 16px;

}
.el-container {
  background: #1C1F29;
  height:100vh;
}
.logo{
  width: 120px;
  height: 40px;
  margin: 0 auto;
  padding-left: 10px;
  padding-top: 36px;
  padding-bottom: 42px;
}
.logo-img{
  float: left;
}
.logo-name{
  float: left;
  font-family: PingFang SC;
  padding-left: 11px;
}
.logo-name > p{
  line-height: 33px;
  margin: 0;
  color: #FFFFFF;
  font-size: 15px;
}
.el-menu {
  border-right: solid 0px #e6e6e6;
}
.el-menu-item {
  font-family: PingFang SC;
  font-size: 9px;
  font-weight: 500;
  height: 46px;
  line-height: 46px;
  padding-left: 28px !important;
  color: #CFD3E0;

}
.el-menu-item-info {
  width:90px;
  color: #ffffff;
}
.active {
  color: #EF4D23 !important;
  font-weight: bold;
}
.el-submenu .el-menu-item {
  padding: 0 8px;
  min-width: 120px;
}
.el_submenu_span_active
{
  color: #ffffff !important;
  font-weight: bold;
}
.el_submenu_active{
  border-left: solid 2px #ffffff;
}
.el-submenu__title {
  font-family: PingFang SC;
  font-size: 10px;
  height: 46px;
  line-height: 46px;
  padding:0 10px 0 24px !important;
}
.el-submenu__title i {
  color: #ffffff;
  font-weight: 500;
}
.el-submenu__icon-arrow {
  right:10px;
  top:55%;
}
.icon-img {
  width: 20px;
  padding-right: 6px;
}
.icon-disk-img {
  width: 18px;
  padding-right: 6px;
}
.router-link {
  text-decoration:none;
}
.mount-btn,.umount-btn{
  font-size: 9px;
  font-family: PingFang SC;
  color: #636670;
  border: 0;
  padding: 2px 8px 2px 8px !important;
  margin: 0 auto;
  position: absolute;
  right: 10px;
  top: 18px;
}
.umount-btn:hover ,.mount-btn:hover {
  color: #ffffff;
  background-color: #EF4D23;
}
.mount-btn:focus,.umount-btn:focus{
  color: #636670;
  background-color: #ffffff;
}
.eject-btn{
  font-size: 8px;
  font-family: PingFang SC;
  color: #EF4D23;
  border: 0;
  padding: 4px 12px 4px 12px !important;
  margin: 0 auto;
  position: absolute;
  right: 18px;
  bottom: 36px;
}
.eject-btn:focus, .eject-btn:hover {
  color: #EF4D23;
  background-color: #ffffff;
}
.eject-img {
  width: 16px;
  float: left;
  padding-right: 8px;
}
.eject-span {
  float: left;
  margin: 0 auto;
  line-height: 16px;
}

.el-message-box {
  width: 360px;
  height: auto;
  padding-bottom: 0px !important;
  /*background-color: #FFF;*/
  background: -webkit-linear-gradient(left,whitesmoke,white);
  border-radius: 16px;
  border: 0px;
  font-size: 16px;
  text-align: left;

}
.el-message-box__header {
  position: relative;
  padding: 24px 32px 16px;
}
.el-message-box__title {
  font-family: PingFang SC;
  color: #303133;
  font-weight: 500;
  color: #636670 ;
}
.el-message-box__headerbtn {
  position: absolute;
  top: 24px;
  right: 36px;
}
.el-message-box__headerbtn .el-message-box__close {
  color: #303133 !important;
}
.el-message-box__content {
  padding: 0px 32px;
  font-size: 16px;
  font-family: PingFang SC;
}
.el-message-box__message {
  font-weight: bold;
  color: #12161F;
}
.el-message-box__input {
  padding-top: 8px;
  height: 36px;
}
.el-input.is-active .el-input__inner, .el-input__inner:focus {
  border-color: #EF4D23;
}
.el-message-box__input .el-input .el-input__inner {
  width: 296px !important;
  height: 32px !important;
  line-height: 32px !important;
  margin-bottom: 0 !important;
}
.el-message-box__btns {
  padding: 0 32px;
  text-align: right;
  margin-bottom: 24px;
  margin-top: 24px;
}

.el-message-box__btns > .el-button {
  border-radius: 16px;

}
.el-message-box__btns button:nth-child(2) {
  margin-left: 24px;
  background-color: #EF4D23;
  border: 0;
}
.el-message-box__btns button:nth-child(1) {
  background: #9B9EA8;
  color: #ffffff;
  border: 0;
}
.el-message-box__btns > .el-button--primary{
  background-color: #EF4D23 !important;
}
.hide {
  display: none !important;
}
</style>