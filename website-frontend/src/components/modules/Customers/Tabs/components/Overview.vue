<template>
  <v-card flat>
    <v-card-title>Overview</v-card-title>
    <v-card-text>{{ text }}</v-card-text>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    text:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  }),
};
</script>
