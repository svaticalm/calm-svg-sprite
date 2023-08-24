<script lang="ts" setup>
defineProps({
    name: String,
    width: Number,
    height: Number,
});
</script>

<template>
    <svg :style="{width: `${width}px`, height: `${height}px`}" :viewBox="`0 0 ${width} ${height}`" class="svg-icon">
        <use v-bind="{ 'xlink:href': `${require('../assets/img/calm-sprite.svg')}#${name}` }"></use>
    </svg>
</template>

<style lang="scss">
.svg-icon {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>