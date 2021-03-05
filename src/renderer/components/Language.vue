<template>
  <div>
  <div class="language-btn">
    <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <span id="language">{{language}}</span>
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="zh_CN">{{$t('language.zh_cn')}}</el-dropdown-item>
        <el-dropdown-item command="zh_TW">{{$t('language.zh_tw')}}</el-dropdown-item>
        <el-dropdown-item command="en_US">{{$t('language.en_us')}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
  <div class="setting-btn" >
    <router-link to="/setting">
      <el-badge v-if="versionStatus ==true" is-dot>
        <img src="~@/assets/setting.png"/>
      </el-badge>
      <el-badge v-if="versionStatus ==false">
        <img src="~@/assets/setting.png"/>
      </el-badge>
    </router-link>
  </div>
  </div>
</template>

<script>
import config from "../../../package.json";
export default {
  data() {
    return {
      versionStatus:false,
      language:this.$t('language.'+this.$i18n.locale.toLowerCase()+'_simple'),
    };
  },
  mounted() {
    this.getVersion()
  },
  methods: {
    handleCommand(command) {
      this.$i18n.locale = command
      localStorage.language = command
      this.language = this.$t('language.'+command.toLowerCase()+'_simple')
    },
    async getVersion(){
      await this.$http.get('https://gitlab.gzqz.work/ntfs/client-api/raw/master/api.json',{
        params:{},
      }).then(resp => {
        if(config.versionCode !== resp.data.version_code) {
          this.versionStatus = true
        }
      })
    },
  }
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

</style>