<template>
    <v-layout row wrap>
      <v-container grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12>
              <v-layout row wrap>
                <v-flex xs12 sm12 md8 lg8>
                  <MyCart :items="customerCartList" />
                </v-flex>
                <v-flex xs12 sm12 md4 lg4>
                  <Summary :items="customerCartList" />
                </v-flex>
              </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
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
