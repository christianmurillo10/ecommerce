<template>
  <v-toolbar id="core-toolbar" :clipped-left="primaryDrawer.clipped" app absolute>
    <v-toolbar-side-icon
      v-if="primaryDrawer.type !== 'permanent'"
      @click.stop="setDrawer(!primaryDrawer.model)"
    ></v-toolbar-side-icon>
    <v-toolbar-title>E-Commerce</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>apps</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>notifications</v-icon>
    </v-btn>
    <!-- <v-btn icon large>
      <v-avatar size="32px" tile>
        <img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify" />
      </v-avatar>
    </v-btn> -->
    <v-menu offset-y transition="slide-x-reverse-transition">
      <template v-slot:activator="{ on }">
        <v-btn icon>
          <v-icon dark v-on="on">settings</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile @click="userProfile">
          <v-list-tile-title>
            <v-icon color="black">account_circle</v-icon>Profile
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="logout">
          <v-list-tile-title>
            <v-icon color="black">logout</v-icon>Logout
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </v-toolbar>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    settings: [
      {
        to: "userProfile",
        icon: "account_circle",
        text: "Profile"
      },
      {
        to: "logout",
        icon: "logout",
        text: "Logout"
      }
    ]
  }),
  computed: {
    ...mapState("toolbar", ["primaryDrawer"])
  },
  methods: {
    ...mapActions("toolbar", ["setDrawer"]),
    ...mapActions("userAuthentication", ["setLogout"]),
    userProfile() {},
    logout() {
      this.setLogout().then(() => {
        this.$router.push("/login");
      });
    }
  },
  created() {
    this.$http.interceptors.response.use(undefined, function(err) {
      return new Promise(function(resolve, reject) {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.$store.dispatch(logout);
        }
        throw err;
      });
    });
  }
};
</script>

<style>
#core-toolbar a {
  text-decoration: none;
}
</style>