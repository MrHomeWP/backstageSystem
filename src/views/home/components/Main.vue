<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <component :is="Component" v-if="main_isShow" />
        </transition>
    </router-view>
</template>

<script setup>
import { ref, nextTick, watch } from "vue"

let main_isShow = ref(true)

//获取setting仓库内的数据
import useSettingStore from "@/store/modules/setting"
let settingStore = useSettingStore()

//监听refreshFlag属性
watch(() => settingStore.refreshFlag, () => {
    main_isShow.value = false
    nextTick(() => {
        main_isShow.value = true
    })
})
</script>

<style lang="scss" scoped>
.fade-enter-from {
    transform: scale(0);
}

.fade-enter-active {
    transition: all .5s;
}

.fade-enter-to {
    transform: scale(1);
}
</style>
