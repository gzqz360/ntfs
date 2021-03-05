<template>
  <div class="footer">
    <div class="footer-item-one">
      <span>{{$t('messages.footer_company')}}</span>
    </div>
    <div class="footer-item-two">
    <span>{{$t('messages.footer_version_number')}}</span>
    </div>
    <div class="footer-item-three">
    <span>{{$t('messages.footer_official_website')}}</span>
    </div>
  </div>
</template>

<style>
.footer {
  position: absolute;
  bottom: 26px;
  padding-left: 20px;
  width: 600px;
  font-size: 10px;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 14px;
  color: #9B9EA8;
  opacity: 1;
}
.footer-item-one{
  width: 172px;
  float: left;
}
.footer-item-two{
  margin-left: 50px;
  width: 104px;
  float: left;
}
.footer-item-three{
  margin-left: 50px;
  width: 200px;
  float: left;
}
</style>