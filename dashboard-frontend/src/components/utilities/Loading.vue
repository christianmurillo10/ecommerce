<template>
  <v-dialog
    v-model="loadingDetails.dialog"
    persistent
    no-click-animation
    width="300"
  >
    <v-card
      color="primary"
      dark
    >
      <v-card-text>
        {{ loadingDetails.text }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState("loading", ["loadingDetails"])
  }
};
</script>