<template>
  <div>
    <div class="setting-title">
      <div class="setting-return-btn">
        <img src="~@/assets/return.png" v-on:click="back"/>
        <img src="~@/assets/set.png"/>
      </div>
      <div class="setting-span">
        <span>{{$t('messages.setting')}}</span>
      </div>
    </div>
    <div class="setting-content">
      <p>
        <span>{{$t('messages.self_start')}}</span>
        <el-switch
            v-model="selfStartValue"
            active-color="#EF4D23"
            inactive-color="#9B9EA8"
            active-value="1"
            inactive-value="0"
            @change="selfStartChange"
        >
        </el-switch>
      </p>
      <p>
        <span class="">{{$t('messages.self_mount')}}</span>
        <el-switch
            v-model="selfMountValue"
            active-color="#EF4D23"
            inactive-color="#9B9EA8"
            active-value="1"
            inactive-value="0"
            @change="selfMountChange"
        >
        </el-switch>
      </p>
<!--      <p>-->
<!--        <span>{{$t('messages.self_repair')}}</span>-->
<!--        <el-switch-->
<!--            v-model="selfRepairValue"-->
<!--            active-color="#EF4D23"-->
<!--            inactive-color="#9B9EA8"-->
<!--            active-value="1"-->
<!--            inactive-value="0"-->
<!--            @change="selfRepairChange"-->
<!--        >-->
<!--        </el-switch>-->
<!--      </p>-->
      <p v-if="versionStatus == 1">
        <span>{{$t('messages.version_new_found')}}{{versionName}}</span>
        <el-button  class="to-update-btn" size="mini" @click="updateNow">{{$t('messages.update_now')}}</el-button>
      </p>
    </div>
    <footer-info/>
  </div>

</template>
<script>
import  FooterInfo from '@/components/Footer'
import config from '../../../package.json'
export default {
  data() {
    return {
      selfStartValue: localStorage.selfStartValue ? localStorage.selfStartValue : 1,
      selfMountValue: localStorage.selfMountValue  ? localStorage.selfMountValue : 1,
      selfRepairValue: localStorage.selfRepairValue,
      versionStatus:0,
      versionName:'',
      versionUrl:''
    }
  },
  mounted() {
    this.getVersion()
  },
  components:{
    FooterInfo,
  },
  methods:{
    back(){
      this.$router.go(-1);//返回上一层
    },
    selfStartChange:function (value){
      localStorage.selfStartValue = value
      const ipcRenderer = require('electron').ipcRenderer;
      if(value == 1) {
        ipcRenderer.send('openAutoStart')
      }else{
        ipcRenderer.send('closeAutoStart')
      }
    },
    selfMountChange:function (value){
      localStorage.setItem('selfMountValue', value)
      this.$emit('settingSelfMount',value);
    },
    selfRepairChange:function (value){
      localStorage.selfRepairValue = value
    },
    updateNow:function (){
      const { shell } = require('electron');
      shell.openExternal(this.versionUrl)
    },
    async getVersion(){
      await this.$http.get('https://gitlab.gzqz.work/ntfs/client-api/raw/master/api.json',{
        params:{},
      }).then(resp => {
        this.versionName = resp.data.version_name
        this.versionUrl = resp.data.version_url
        if(config.versionCode !== resp.data.version_code) {
          this.versionStatus = 1
        }
      })
    },
  },
};
</script>


<style>
.setting-title {
  margin-top: 69px;
  margin-left: 80px;
  width: 350px;
  height: 20px;
}
.setting-return-btn {
  float: left;
}
.setting-span {
  float: left;
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #12161F;
  opacity: 1;
  padding-left: 4px;
}
.setting-content {
  margin-top: 53px;
  margin-left: 100px;
  width: 444px;
  position: relative;
  font-size: 13px;
  font-family: PingFang SC;
  line-height: 20px;
  color: #636670;
  opacity: 1;
}
.setting-content > p {
  margin-bottom: 26px;
}
.setting-content > p:last-child {
  margin-top: 42px;
  margin-bottom: 0;
}
.el-switch {
  position: absolute;
  right: 0px;
}
.to-update-btn {
  /*position: absolute;*/
  /*right: 0px;*/
  /*top: 152px;*/
  float: right;
  background-color: #EF4D23;
  outline:none;
  opacity: 1;
  border-radius: 4px;
  font-size: 10px;
  font-family: PingFang SC;
  color: #F5F6FA;
  display:block;
  border: 0;
  padding: 6px 15px;
}
.to-update-btn:focus, .to-update-btn:hover {
  color: #F5F6FA;
  border: 1px solid #EF4D23;
  background-color: #EF4D23;
}
</style>