<template>
  <!-- <v-app-bar app color="teal accent-4" dark> -->
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="setPrimaryDrawerModel(!primaryDrawer.model)" />
    <router-link to="/">
      <v-toolbar-title style="width: 500px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">E-Commerce</span>
      </v-toolbar-title>
    </router-link>
    <v-text-field
      flat
      solo-inverted
      hide-details
      prepend-inner-icon="mdi-magnify"
      label="Search"
      class="hidden-sm-and-down"
    />
    <v-spacer />
    <v-btn icon>
      <v-icon>mdi-cart</v-icon>
    </v-btn>
    <v-btn icon to="/profile">
      <v-icon>mdi-account</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  data: () => ({}),
  computed: {
    ...mapState("appbar", ["primaryDrawer"])
  },
  methods: {
    ...mapActions("appbar", ["setPrimaryDrawerModel"])
  }
};
</script>