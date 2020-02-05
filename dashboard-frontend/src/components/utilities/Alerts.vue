<template>
  <div id="utilities-alert">
    <v-alert
      v-model="alertDetails.alert"
      :type="alertDetails.type"
      dismissible
      dense
      outline
    >{{ alertDetails.message }}</v-alert>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState("alerts", ["alertDetails"])
  }
};
</script>