<template>
  <v-app>
    <template v-if="isLoggedIn">
      <core-toolbar/>
      <core-drawer/>
      <core-view/>
      <core-footer/>
    </template>
    <template v-else>
      <login/>
    </template>
  </v-app>
</template>

<script>
import Login from "./views/Login";
import { mapGetters, mapActions } from "vuex";

export default {
  data: () => ({}),
  components: {
    Login
  },
  computed: {
    ...mapGetters("userAuthentication", ["isLoggedIn"])
  },
  mounted() {
    this.validateToken();
  },
  methods: {
    ...mapActions("userAuthentication", ["validateToken"])
  }
};
</script>