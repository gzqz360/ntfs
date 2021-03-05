<template>
    <div class="disk-repair">
      <p>{{$t('messages.repair_tip')}}</p>
      <el-input
          type="textarea"
          :rows="5"
          placeholder=""
          v-model="repairLog">
      </el-input>
      <div class="repair-btn-div">
<!--      <el-button round size="mini" class="check-btn">{{$t('messages.repair_check_btn')}}</el-button>-->
      <el-button round size="mini" class="repair-btn" @click="repairDisk()" v-if="repairStatus ==0">{{$t('messages.repair_btn')}}</el-button>
        <el-button round size="mini" class="repair-btn repairing" v-if="repairStatus ==1" icon="el-icon-loading">{{$t('messages.repair_btn')}}</el-button>
      </div>
    </div>
</template>

<script>
import {getDiskList,repairDisk} from '@/utils/utils'
const storage = require('electron-localstorage');
export default {
    name:'repair',
    data() {
      return {
        diskData:[],
        diskList:[],
        repairLog:'',
        repairStatus:1
      }
    },
    props: ['diskInfo'],

    watch: {
      diskInfo:{
        immediate: true,
        async handler(val) {
          console.log(val);
          this.diskData = val
          var key = val['_Device_Identifier']
          if(storage.getItem('repairLog_'+key) != undefined){
            this.repairLog = storage.getItem('repairLog_'+key)
          }else{
            this.repairLog = ''
          }
          if(storage.getItem('repairStatus_'+key) != undefined && storage.getItem('repairStatus_'+key) == 1){
            this.repairStatus = 1
          }else{
            this.repairStatus = 0
          }
        }
      }
    },
    methods: {
      getDiskList(index=''){
        getDiskList().then((res) => {
          this.$emit('refreshDiskList',JSON.parse(JSON.stringify(res)));
        }).catch((e)=>{
          this.$emit('refreshDiskList',[]);
        })
      },
      repairDisk(){
        var diskPath = this.diskData['_Device_Node']
        var mounted = this.diskData['_Mounted']
        var key = this.diskData['_Device_Identifier']
        storage.setItem('repairStatus_'+key, 1)
        this.repairStatus = 1
        repairDisk(diskPath,mounted).then((res) => {
          this.repairLog = res
          storage.setItem('repairLog_'+key, res);
          storage.setItem('repairStatus_'+key, 0);
          if(this.diskData['_Device_Identifier'] == key) {
            this.repairStatus = 0
          }
        }).catch((e) => {
          this.repairLog = e
          storage.setItem('repairLog_'+key, e)
          storage.setItem('repairStatus_'+key, 0)
          if(this.diskData['_Device_Identifier'] == key) {
            this.repairStatus = 0
          }
        })
      },
    }
}

</script>


<style>
.disk-repair > p {
  font-size: 12px;
  font-family: PingFang SC;
  line-height: 20px;
  color: #636670;
  margin: 16px 0;
}
.el-textarea {
  width: 350px;
}
.el-textarea__inner {
  border: 0;
}
.repair-btn-div {
  position: relative;
}
.check-btn {
  margin-top: 28px;
  font-size: 11px;
  font-family: PingFang SC;
  line-height: 16px;
  color: #636670;
  padding: 4px 18px;
  border: 0;
  color: #ffffff;
  background-color: #EF4D23;
}
.repair-btn {
  margin-top: 28px;
  font-size: 11px;
  font-family: PingFang SC;
  line-height: 16px;
  color: #ffffff;
  background-color: #EF4D23;
  padding: 4px 18px;
  border: 0;
  position: absolute;
  right: 50px;
}
.check-btn:focus,.repair-btn:focus,.check-btn:hover,.repair-btn:hover{
  color: #ffffff;
  background-color: #EF4D23;
}
.repairing {
  color: #9B9EA8;
  background-color: #ffffff;
  padding: 2px 18px;
}
.repairing:focus,.repairing:hover{
  background-color: #ffffff;
  color: #9B9EA8;
}

</style>