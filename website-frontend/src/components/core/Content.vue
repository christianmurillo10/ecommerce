<template>
  <v-content>
    <div class="hidden-md-and-up mt-n11"></div>
    <v-container class="mx-auto" style="max-width: 1280px;">
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-container>
  </v-content>
</template>
