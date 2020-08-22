<template>
  <v-toolbar
    id="core-toolbar"
    :clipped-left="primaryDrawer.clipped"
    app
    absolute
  >
    <v-toolbar-side-icon
      v-if="primaryDrawer.type !== 'permanent'"
      @click.stop="setDrawer(!primaryDrawer.model)"
    ></v-toolbar-side-icon>
    <v-img :src="avatar" max-height="40px" max-width="200px"></v-img>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>apps</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>notifications</v-icon>
    </v-btn>
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
        text: "Profile",
      },
      {
        to: "logout",
        icon: "logout",
        text: "Logout",
      },
    ],
  }),
  computed: {
    ...mapState("toolbar", ["primaryDrawer"]),

    avatar() {
      return "/img/logo.png";
    },
  },
  methods: {
    ...mapActions("toolbar", ["setDrawer"]),
    ...mapActions("userAuthentication", ["setLogout"]),
    userProfile() {},
    logout() {
      this.setLogout().then(() => {
        this.$router.push("/login");
      });
    },
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
  },
};
</script>

<style>
#core-toolbar a {
  text-decoration: none;
}
</style>
