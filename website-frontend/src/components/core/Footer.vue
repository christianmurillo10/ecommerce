<template>
  <!-- <v-footer color="orange lighten-1" dark> -->
  <v-footer dark>
    <v-row justify="center" no-gutters>
      <v-btn v-for="link in links" :key="link" color="white" text rounded class="my-2">{{ link }}</v-btn>
      <!-- <v-col class="deep-orange lighten-2 py-4 text-center white--text" cols="12"> -->
      <v-col class="black lighten-1 py-4 text-center white--text" cols="12">
        {{ new Date().getFullYear() }} —
        <strong>ARK</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: ["Home", "Categories", "Products", "Terms and Conditions", "About Us", "Contact Us"]
  })
};
</script>