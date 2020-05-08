<template>
  <v-navigation-drawer
    v-model="primaryDrawer.model"
    :temporary="primaryDrawer.type"
    absolute
    overflow
    app
    dark
    mobile-break-point="991"
    width="270"
  >
    <v-list dense class="ml-n0">
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="avatar"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list dense>
      <template v-for="item in items">
        <v-list-group
          v-if="item.children"
          :key="item.text"
          v-model="item.model"
          :prepend-icon="item.model ? item.icon : item['icon-alt']"
          append-icon
        >
          <template v-slot:activator>
            <v-list-item-content class="ml-n6">
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item v-for="(child, i) in item.children" link :key="i" :to="child.to" class="pl-12">
            <v-list-item-action v-if="child.icon">
              <v-icon>{{ child.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ child.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item v-else :key="item.text" link :to="item.to">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content class="ml-n6">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Mixins from "@/helpers/Mixins.js";

export default {
  mixins: [Mixins],

  data: () => ({
    items: [
      { icon: "mdi-home", text: "Home", to: "/" },
      {
        icon: "mdi-file-document-box-outline",
        text: "Terms and Conditions",
        to: "/termsAndConditions"
      },
      { icon: "mdi-information-outline", text: "About Us", to: "/aboutUs" },
      { icon: "mdi-phone", text: "Contact Us", to: "/contactUs" }
    ]
  }),

  mounted() { },

  watch: { },

  computed: {
    ...mapState("appbar", ["primaryDrawer"]),
    avatar() {
      return "/img/logo.png";
    },
    title() {
      return "Welcome to E-Commerce";
    }
  },

  methods: { }
};
</script>

<style>
.margin-left-n10 {
  margin-left: -10px !important;
}
</style>
