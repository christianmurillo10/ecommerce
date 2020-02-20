<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12 lg12>
      <v-toolbar flat dense class="hidden-sm-and-down">
        <v-container class="col-lg-10 offset-lg-1">
          <v-layout row wrap>
            <v-flex xs12 sm12 md6 lg6>
              <v-layout>
                <p class="font-weight-medium subtitle-2 my-1">Follow us on</p>
                <v-btn icon small>
                  <v-icon>mdi-facebook</v-icon>
                </v-btn>
                <v-btn icon small>
                  <v-icon>mdi-instagram</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <v-layout justify-end>
                <v-btn text small>Track My Order</v-btn>
                <v-btn text small>Login</v-btn>
                <v-btn text small>Registration</v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-toolbar>
      <v-toolbar>
        <v-container class="col-lg-10 offset-lg-1">
          <v-layout row wrap>
            <v-flex xs4 sm4 md4 lg4>
              <v-layout justify-start>
                <v-app-bar-nav-icon @click.stop="setPrimaryDrawerModel(!primaryDrawer.model)" />
                <router-link to="/">
                  <v-img :src="avatar" max-height="50px" max-width="50px"></v-img>
                </router-link>
              </v-layout>
            </v-flex>
            <v-flex xs4 sm4 md4 lg4>
              <v-layout row wrap>
                <v-text-field
                  flat
                  outlined
                  hide-details
                  clearable
                  dense
                  placeholder="Search"
                  class="hidden-sm-and-down"
                />
                <v-btn outlined color="grey" height="40px">
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs4 sm4 md4 lg4>
              <v-layout justify-end>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-badge color="red" content="0">
                        <v-icon>mdi-heart</v-icon>
                      </v-badge>
                    </v-btn>
                  </template>
                  <span>Wishlist</span>
                </v-tooltip>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                      <v-badge color="green" content="0">
                        <v-icon>mdi-cart</v-icon>
                      </v-badge>
                    </v-btn>
                  </template>
                  <span>Cart</span>
                </v-tooltip>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-toolbar>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data: () => ({}),
  computed: {
    ...mapState("appbar", ["primaryDrawer"]),
    avatar() {
      return "/img/logo.png";
    }
  },
  methods: {
    ...mapActions("appbar", ["setPrimaryDrawerModel"])
  }
};
</script>