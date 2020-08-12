<template>
  <v-card outlined>
    <v-card-title>
      SUMMARY
      <v-spacer></v-spacer>
      <v-chip
        color="green"
        text-color="white"
        label
        small
      >{{items.length}} Items</v-chip>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-flex xs12 sm12 md12 lg12>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Quantity</th>
                <th class="text-left">Item</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in items" :key="item.index">
                <td class="text-left">{{ `&#8369; ${item.price} x ${item.quantity}` }}</td>
                <td class="text-left">{{ `${item.name}` }}</td>
                <td class="text-right">{{ `&#8369; ${item.total_price}` }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-flex>
      <v-divider></v-divider>
      <v-flex xs12 sm12 md12 lg12>
        <v-list-item>
          <v-flex xs12 sm12 md12 lg12>
            <v-layout row wrap>
              <v-flex xs6 sm6 md6 lg6>
                <div class="body-2 font-weight-light">Total Purchase</div>
              </v-flex>
              <v-flex xs6 sm6 md6 lg6>
                <div
                  class="subtitle-2 text-right"
                >{{ `&#8369; ${getCustomerCartTotalPrice}` }}</div>
              </v-flex>
              <v-flex xs6 sm6 md6 lg6>
                <div class="body-2 font-weight-light">Shipping Fee</div>
              </v-flex>
              <v-flex xs6 sm6 md6 lg6>
                <div class="subtitle-2 text-right">&#8369; 0.00</div>
              </v-flex>
              <v-flex xs6 sm6 md6 lg6>
                <div class="body-2 font-weight-light">Sub Total</div>
              </v-flex>
              <v-flex xs6 sm6 md6 lg6>
                <div
                  class="subtitle-2 text-right"
                >{{ `&#8369; ${getCustomerCartTotalPrice}` }}</div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-list-item>
      </v-flex>
      <v-divider></v-divider>
      <v-flex xs12 sm12 md12 lg12>
        <v-list-item>
          <v-flex xs12 sm12 md12 lg12>
            <v-layout row wrap>
              <v-flex xs6 sm6 md6 lg6>
                <div class="body-2 font-weight-light">Total Discount</div>
              </v-flex>
              <v-flex xs6 sm6 md6 lg6>
                <div class="subtitle-2 text-right">&#8369; 0.00</div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-list-item>
      </v-flex>
      <v-divider></v-divider>
      <v-flex xs12 sm12 md12 lg12>
        <v-list-item>
          <v-flex xs12 sm12 md12 lg12>
            <v-layout row wrap>
              <v-flex xs6 sm6 md6 lg6>
                <div class="body-2 font-weight-medium">Total Amount Pay</div>
              </v-flex>
              <v-flex xs6 sm6 md6 lg6>
                <div
                  class="subtitle-2 text-right"
                >{{ `&#8369; ${getCustomerCartTotalPrice}` }}</div>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-list-item>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-layout row wrap class="text-center">
          <v-flex xs12 sm12 md12 lg12>
            <v-btn block rounded color="blue" class="ma-2 white--text" @click="cart = false">
              <v-icon left dark>mdi-basket</v-icon>CHECKOUT
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    items: Array
  },
  
  computed: {
    ...mapGetters("customerCarts", ["getCustomerCartTotalPrice"])
  },
}
</script>