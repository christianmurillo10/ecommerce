<template>
  <v-snackbar
    v-model="snackbarDetails.snackbar"
    :color="snackbarDetails.color"
    :timeout="snackbarDetails.timeout"
    top
  >
    {{ snackbarDetails.text }}
    <v-btn dark text @click="close()">Close</v-btn>
  </v-snackbar>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState("snackbars", ["snackbarDetails"]),
  },

  methods: {
    ...mapMutations("snackbars", { closeSnackbar: "CLOSE_SNACKBAR" }),

    close() {
      this.closeSnackbar();
    },
  },
};
</script>
