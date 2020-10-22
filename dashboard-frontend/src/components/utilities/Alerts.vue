<template>
  <div id="utilities-alert">
    <v-alert
      v-model="alertDetails.alert"
      :type="alertDetails.type"
      :outline="alertDetails.outline"
      dismissible
      dense
    >
      <div v-for="(message, i) in alertDetails.message" :key="i">
        {{ message }}
      </div>
    </v-alert>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("alerts", ["alertDetails"]),
  },
};
</script>
