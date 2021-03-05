<template>
  <div class="modal">
    <div class="center">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.modal {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0,0,0,.5);
  z-index: 10;
}

.loading .center {
  position: position;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>