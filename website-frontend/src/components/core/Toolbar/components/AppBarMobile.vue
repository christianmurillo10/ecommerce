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
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" v-on:click="setSearch">
                  <v-icon>{{ search ? "mdi-close" : "mdi-magnify" }}</v-icon>
                </v-btn>
              </template>
              <span>{{ search ? "Close" : "Search" }}</span>
            </v-tooltip>
            <Cart />
          </v-layout>
        </v-flex>
      </v-layout>
      <v-divider v-if="search"></v-divider>
    </v-container>
    <template v-slot:extension v-if="search">
      <v-container style="max-width: 1280px;">
        <v-flex xs12 sm12 md12 lg12>
          <Search />
        </v-flex>
      </v-container>
    </template>
  </v-app-bar>
</template>

<script>
import Cart from "./Cart";
import Search from "./Search";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Cart,
    Search,
  },

  data: () => ({
    search: false,
  }),

  computed: {
    ...mapState("appbar", ["primaryDrawer"]),

    avatar() {
      return "/img/logo.png";
    },
  },

  methods: {
    ...mapActions("appbar", ["setPrimaryDrawerModel"]),

    setSearch() {
      this.search = this.search ? false : true;
    },
  },
};
</script>
