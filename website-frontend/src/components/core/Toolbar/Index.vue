<template>
  <v-flex xs12 sm12 md12 lg12>
    <AppBarDesktop class="hidden-sm-and-down" />
    <AppBarMobile class="hidden-md-and-up" />
    <v-btn
      v-scroll="onScroll"
      v-show="fab"
      fab
      dark
      fixed
      bottom
      right
      small
      color="primary"
      @click="toTop"
    >
      <v-icon>mdi-chevron-up</v-icon>
    </v-btn>
  </v-flex>
</template>

<script>
import AppBarDesktop from "./components/AppBarDesktop";
import AppBarMobile from "./components/AppBarMobile";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    AppBarDesktop,
    AppBarMobile,
  },

  data: () => ({
    fab: false,
  }),

  created() {
    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function(resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(logout);
        }
        throw err;
      });
    });
  },

  methods: {
    onScroll(e) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || e.target.scrollTop || 0;
      this.fab = top > 300;
    },

    toTop() {
      this.$vuetify.goTo(0);
    },
  },
};
</script>
