<template>
  <v-container class="col-lg-10 offset-lg-1">
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md8 lg8>
              <MyCart :items="customerCartList" />
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <Summary :items="customerCartList" />
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import MyCart from "./components/MyCart";
import Summary from "./components/Summary";
import { mapState } from "vuex";

export default {
  components: {
    MyCart,
    Summary
  },

  computed: {
    ...mapState("customerCarts", ["customerCartList"])
  },
};
</script>
