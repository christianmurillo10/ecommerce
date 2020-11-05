<template>
  <v-layout wrap>
    <v-container class="content">
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>
          <v-layout wrap>
            <v-flex xs12 sm12 md8 lg8>
              <v-container>
                <Details :items="customerCartList" />
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <v-container>
                <Summary :items="customerCartList" />
              </v-container>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import Details from "@/components/modules/Checkout/Details";
import Summary from "@/components/modules/Cart/Summary";
import { mapState } from "vuex";

export default {
  components: {
    Details,
    Summary,
  },

  computed: {
    ...mapState("customerCarts", ["customerCartList"]),
  },
};
</script>
