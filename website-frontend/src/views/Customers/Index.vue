<template>
  <v-layout row wrap>
    <v-container grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 sm12 md3 lg3>
          <Information />
        </v-flex>
        <v-flex xs12 sm12 md9 lg9>
          <Tabs />
        </v-flex>
      </v-layout>
    </v-container>
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
