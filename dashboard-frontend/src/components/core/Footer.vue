<template>
  <v-footer 
    id="core-footer"
    :inset="footer.inset" 
    app
  >
    <v-spacer></v-spacer>
    <span class="px-3">&copy; {{ new Date().getFullYear() }}</span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    footer: {
      inset: true
    }
  })
}
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>