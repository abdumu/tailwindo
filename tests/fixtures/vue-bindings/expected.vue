<template>
  <div :class="{ 'hidden': isHidden, 'block': !isHidden }"></div>
  <div :class="['flex', isOk ? 'text-blue-600' : 'text-red-600']"></div>
  <div :class="`d-inline-block ${d}`"></div>
</template>
