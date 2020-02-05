<template>
  <v-snackbar
    v-model="snackbarDetails.snackbar"
    :color="snackbarDetails.color"
    :timeout="snackbarDetails.timeout"
    top
  >
    {{ snackbarDetails.text }}
    <v-btn color="transparent" text @click="closeSnackbar">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState("snackbars", ["snackbarDetails"])
  },

  methods: {
    ...mapActions("snackbars", ['closeSnackbar']),
  }
};
</script>