<template>
  <div :class="{ 'd-none': isHidden, 'd-block': !isHidden }"></div>
  <div :class="['d-flex', isOk ? 'text-primary' : 'text-danger']"></div>
  <div :class="`d-inline-block ${d}`"></div>
</template>
