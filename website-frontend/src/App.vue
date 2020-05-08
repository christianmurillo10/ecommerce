<template>
  <v-app>
    <Drawer/>
    <Toolbar/>
    <Content/>
    <Footer/>
  </v-app>
</template>

<script>
import Drawer from './components/core/Drawer';
import Toolbar from './components/core/Toolbar/Index';
import Content from './components/core/Content';
import Footer from './components/core/Footer';

export default {
  name: 'App',

  components: {
    Drawer,
    Toolbar,
    Content,
    Footer
  },

  data: () => ({
    //
  }),
};
</script>

<style lang="sass">
  @import '../node_modules/typeface-roboto/index.css'
</style>