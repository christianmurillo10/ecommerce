<template>
  <v-flex xs12 sm12 md12 lg12>
    <v-toolbar elevation="0">
      <v-container class="mx-auto mt-2" style="max-width: 1280px;">
        <v-layout row wrap>
          <v-flex xs8 sm8 md4 lg4>
            <v-layout justify-start>
              <v-app-bar-nav-icon
                class="hidden-md-and-up"
                @click.stop="setPrimaryDrawerModel(!primaryDrawer.model)"
              />
              <router-link to="/">
                <v-img
                  :src="avatar"
                  max-height="40px"
                  max-width="200px"
                ></v-img>
              </router-link>
            </v-layout>
          </v-flex>
          <v-flex md4 lg4 class="hidden-sm-and-down">
            <Search />
          </v-flex>
          <v-flex xs4 sm4 md4 lg4>
            <v-layout justify-end>
              <v-tooltip left>
                <template v-slot:activator="onTooltip">
                  <v-btn icon v-on="onTooltip.on">
                    <v-badge color="red" content="0">
                      <v-icon>mdi-heart</v-icon>
                    </v-badge>
                  </v-btn>
                </template>
                <span>Wishlist</span>
              </v-tooltip>
              <Cart />
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-toolbar>
    <v-divider></v-divider>
    <v-toolbar dense elevation="1" class="hidden-sm-and-down">
      <v-container style="max-width: 1280px;">
        <v-layout row wrap>
          <v-flex xs12 sm12 md4 lg4>
            <v-container fill-height>
              <v-row justify="start">
                <Categories />
              </v-row>
            </v-container>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4>
            <v-container fill-height>
              <v-row justify="center">
                <v-btn text small to="/" color="blue">Home</v-btn>
                <v-btn text small color="blue">Promo</v-btn>
                <v-btn text small color="blue">About Us</v-btn>
                <v-btn text small color="blue">Contact Us</v-btn>
              </v-row>
            </v-container>
          </v-flex>
          <v-flex xs12 sm12 md4 lg4>
            <v-container fill-height justify-end>
              <v-row justify="end">
                <v-btn text small color="blue">Track My Order</v-btn>
                <div v-if="isLoggedIn">
                  <v-btn text small to="/profile" color="blue">Profile</v-btn>
                  <v-btn text small @click="logout" color="blue">Logout</v-btn>
                </div>
                <div v-else>
                  <v-btn text small to="/register" color="blue">Register</v-btn>
                  <v-btn text small to="/login" color="blue">Login</v-btn>
                </div>
              </v-row>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
    </v-toolbar>
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
import Cart from "./components/Cart";
import Categories from "./components/Categories";
import Search from "./components/Search";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    Cart,
    Categories,
    Search,
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

  computed: {
    ...mapState("appbar", ["primaryDrawer"]),
    ...mapGetters("customerAuthentication", ["isLoggedIn"]),

    avatar() {
      return "/img/logo.png";
    },
  },

  methods: {
    ...mapActions("appbar", ["setPrimaryDrawerModel"]),
    ...mapActions("customerAuthentication", ["setLogout"]),

    logout() {
      this.setLogout().then(() => {
        this.$router.push("/login");
      });
    },

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
