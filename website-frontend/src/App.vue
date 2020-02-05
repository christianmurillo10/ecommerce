<template>
  <v-app>
    <Drawer/>
    <Appbar/>
    <Content/>
    <Footer/>
  </v-app>
</template>

<script>
import Drawer from './components/core/Drawer';
import Appbar from './components/core/Appbar';
import Content from './components/core/Content';
import Footer from './components/core/Footer';

export default {
  name: 'App',

  components: {
    Drawer,
    Appbar,
    Content,
    Footer
  },

  data: () => ({
    //
  }),
};
</script>
