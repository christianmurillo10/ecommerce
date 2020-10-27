<template>
  <v-footer id="core-footer" :inset="footer.inset" app>
    <!-- <v-spacer></v-spacer> -->
    <span class="px-3">
      Developed by
      <a v-bind:href="url" target="_blank">Christian Murillo</a>
      &copy;
      {{ new Date().getFullYear() }}
    </span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    url: "https://christianmurillo10.github.io/",
    footer: {
      inset: true,
    },
  }),
};
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
