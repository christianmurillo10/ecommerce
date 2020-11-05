<template>
  <v-app>
    <Drawer />
    <Toolbar />
    <Main />
    <Footer />
  </v-app>
</template>

<script>
import Drawer from "./components/core/Drawer";
import Toolbar from "./components/core/Toolbar/Index";
import Main from "./components/core/Main";
import Footer from "./components/core/Footer";
import { mapActions } from "vuex";

export default {
  name: "App",
  components: {
    Drawer,
    Toolbar,
    Main,
    Footer,
  },
  mounted() {
    this.validateToken();
  },
  methods: {
    ...mapActions("customerAuthentication", ["validateToken"]),
  },
};
</script>

<style lang="scss">
@import "../node_modules/typeface-roboto/index.css";
@import "./assets/scss/global.scss";
</style>
