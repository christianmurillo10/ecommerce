<template>
  <v-app-bar app fixed flat color="white">
    <v-container class="content mx-auto mt-2">
      <v-layout row wrap>
        <v-flex xs8 sm8 md4 lg4>
          <v-layout justify-start>
            <router-link to="/">
              <v-img :src="avatar" max-height="40px" max-width="200px"></v-img>
            </router-link>
          </v-layout>
        </v-flex>
        <v-flex md4 lg4 class="hidden-sm-and-down">
          <Search />
        </v-flex>
        <v-flex xs4 sm4 md4 lg4>
          <v-layout justify-end>
            <v-tooltip bottom>
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
      <v-divider></v-divider>
    </v-container>
    <template v-slot:extension>
      <v-container class="content">
        <v-layout wrap>
          <v-flex xs12 sm12 md4 lg4>
            <v-container fill-height>
              <v-row justify="start">
                <Categories />
              </v-row>
            </v-container>
          </v-flex>
          <v-flex xs12 sm12 md8 lg8>
            <v-container fill-height justify-end>
              <v-row justify="end">
                <v-btn text small color="blue" to="/">Home</v-btn>
                <v-btn text small color="blue" to="/about-us">About Us</v-btn>
                <v-btn text small color="blue" to="/contact-us"
                  >Contact Us</v-btn
                >
                <v-btn text small color="blue" to="/track-order"
                  >Track Order</v-btn
                >
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
    </template>
  </v-app-bar>
</template>

<script>
import Cart from "./Cart";
import Categories from "./Categories";
import Search from "./Search";
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  components: {
    Cart,
    Categories,
    Search,
  },

  computed: {
    ...mapGetters("customerAuthentication", ["isLoggedIn"]),

    avatar() {
      return "/img/logo.png";
    },
  },

  methods: {
    ...mapActions("customerAuthentication", ["setLogout"]),

    logout() {
      this.setLogout().then(() => {
        this.$router.push("/login");
      });
    },
  },
};
</script>
