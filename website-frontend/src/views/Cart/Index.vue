<template>
  <v-layout wrap>
    <v-container class="content">
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>
          <v-layout wrap>
            <v-flex xs12 sm12 md8 lg8>
              <v-container>
                <MyCart :items="customerCartList" />
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg12>
                  <v-container>
                    <Summary :items="customerCartList" />
                  </v-container>
                </v-flex>
                <v-flex xs12 sm12 md12 lg12>
                  <v-container>
                    <v-btn
                      block
                      rounded
                      color="blue"
                      class="white--text"
                      to="/checkout"
                    >
                      <v-icon left dark>mdi-basket</v-icon>CHECKOUT
                    </v-btn>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import MyCart from "@/components/modules/Cart/MyCart";
import Summary from "@/components/modules/Cart/Summary";
import { mapState } from "vuex";

export default {
  components: {
    MyCart,
    Summary,
  },

  computed: {
    ...mapState("customerCarts", ["customerCartList"]),
  },
};
</script>
