<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md3 lg3>
      <v-container>
        <Information />
      </v-container>
    </v-flex>
    <v-flex xs12 sm12 md9 lg9>
      <v-container>
        <Tabs />
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import Information from "./components/Information";
import Tabs from "./components/Tabs/Index";

export default {
  components: {
    Information,
    Tabs,
  },
};
</script>
