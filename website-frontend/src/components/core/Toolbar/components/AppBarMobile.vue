<template>
  <v-app-bar fixed>
    <v-container class="mx-auto mt-2" style="max-width: 1280px;">
      <v-layout row wrap>
        <v-flex xs8 sm8 md4 lg4>
          <v-layout justify-start>
            <v-app-bar-nav-icon
              @click.stop="setPrimaryDrawerModel(!primaryDrawer.model)"
            />
            <router-link to="/">
              <v-img :src="avatar" max-height="40px" max-width="200px"></v-img>
            </router-link>
          </v-layout>
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
  </v-app-bar>
</template>

<script>
import Cart from "./Cart";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Cart,
  },

  computed: {
    ...mapState("appbar", ["primaryDrawer"]),

    avatar() {
      return "/img/logo.png";
    },
  },

  methods: {
    ...mapActions("appbar", ["setPrimaryDrawerModel"]),
  },
};
</script>
