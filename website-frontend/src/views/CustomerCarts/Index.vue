<template>
  <v-container class="col-lg-10 offset-lg-1">
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md8 lg8>
              <v-container>
                <v-card>
                  <v-card-title>MY CART</v-card-title>
                  <v-divider class="mx-4"></v-divider>
                  <v-card-text>
                    <v-simple-table>
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">Image</th>
                            <th class="text-left">Product</th>
                            <th class="text-left">Color</th>
                            <th class="text-left">Price</th>
                            <th class="text-center">Quantity</th>
                            <th class="text-left">Total Price</th>
                            <th class="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="item in customerCartList" :key="item.index">
                            <td>
                              <router-link v-bind:to="`/product/${item.product_id}`">
                                <v-img :src="item.file_path" max-width="100px"></v-img>
                              </router-link>
                            </td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.color }}</td>
                            <td class="text-right">{{ `&#8369${item.price}` }}</td>
                            <td class="text-center" width="200px">
                              <v-text-field
                                v-model="item.quantity"
                                dense
                                rounded
                                outlined
                                type="number"
                                class="inputQuantity mt-2 mb-n4"
                                append-icon="mdi-plus"
                                @click:append="increment(item.index)"
                                prepend-inner-icon="mdi-minus"
                                @click:prepend-inner="decrement(item.index)"
                                :rules="validateItem.quantityRules"
                              ></v-text-field>
                            </td>
                            <td class="text-right">{{ `&#8369${item.total_price}` }}</td>
                            <td class="text-center">
                              <v-icon small @click="deleteCartData(item.index)">mdi-delete</v-icon>
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md4 lg4>
              <v-container>
                <v-card>
                  <v-card-title>
                    SUMMARY
                    <v-spacer></v-spacer>
                    <v-chip
                      class="ma-2"
                      color="green"
                      label
                      text-color="white"
                    >{{customerCartList.length}} Items</v-chip>
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text>
                    <v-flex xs12 sm12 md12 lg12>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-center">Quantity</th>
                              <th class="text-left">Product</th>
                              <th class="text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="item in customerCartList" :key="item.index">
                              <td class="text-center">{{ `${item.quantity}` }}</td>
                              <td>{{ `${item.name}` }}</td>
                              <td class="text-right">{{ `&#8369${item.price}` }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-flex>
                    <v-divider></v-divider>
                    <v-container>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-list-item>
                          <v-flex xs12 sm12 md12 lg12>
                            <v-layout row wrap>
                              <v-flex xs6 sm6 md6 lg6>
                                <div class="body-2 font-weight-light">TOTAL PURCHASE</div>
                              </v-flex>
                              <v-flex xs6 sm6 md6 lg6>
                                <div
                                  class="subtitle-2 text-right"
                                >{{ `&#8369${getCustomerCartTotalPrice}` }}</div>
                              </v-flex>
                              <v-flex xs6 sm6 md6 lg6>
                                <div class="body-2 font-weight-light">SHIPPING FEE</div>
                              </v-flex>
                              <v-flex xs6 sm6 md6 lg6>
                                <div class="subtitle-2 text-right">&#8369 0.00</div>
                              </v-flex>
                              <v-flex xs6 sm6 md6 lg6>
                                <div class="body-2 font-weight-light">SUB TOTAL</div>
                              </v-flex>
                              <v-flex xs6 sm6 md6 lg6>
                                <div
                                  class="subtitle-2 text-right"
                                >{{ `&#8369${getCustomerCartTotalPrice}` }}</div>
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
                                <div class="body-2 font-weight-light">TOTAL DISCOUNT</div>
                              </v-flex>
                              <v-flex xs6 sm6 md6 lg6>
                                <div class="subtitle-2 text-right">&#8369 0.00</div>
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
                                <div class="body-2 font-weight-medium">TOTAL AMOUNT PAY</div>
                              </v-flex>
                              <v-flex xs6 sm6 md6 lg6>
                                <div
                                  class="subtitle-2 text-right"
                                >{{ `&#8369${getCustomerCartTotalPrice}` }}</div>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-list-item>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-layout row wrap class="text-center">
                          <v-flex xs12 sm12 md12 lg12>
                            <v-btn color="blue-grey" class="ma-2 white--text" @click="cart = false">
                              <v-icon left dark>mdi-basket</v-icon>CHECKOUT
                            </v-btn>
                          </v-flex>
                        </v-layout>
                      </v-flex>
                    </v-container>
                  </v-card-text>
                </v-card>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    validateItem: {
      quantityRules: [
        v => !!v || "Quantity is required",
        v => v <= 10 || "Quantity must be less than or equal 10"
      ]
    }
  }),

  mounted() {},

  computed: {
    ...mapState("customerCarts", ["customerCartList"]),
    ...mapGetters("customerCarts", ["getCustomerCartTotalPrice"])
  },

  methods: {
    ...mapMutations("customerCarts", {
      updateCartData: "UPDATE_DATA"
    }),
    ...mapMutations("customerCarts", {
      deleteCartData: "DELETE_DATA"
    }),

    decrement(index) {
      if (this.customerCartList[index].quantity > 1) {
        this.customerCartList[index].quantity--;
        let obj = {
          index: index,
          quantity: this.customerCartList[index].quantity
        };
        this.updateCartData(obj);
      }
    },
    increment(index) {
      if (this.customerCartList[index].quantity < 10) {
        this.customerCartList[index].quantity++;
        let obj = {
          index: index,
          quantity: this.customerCartList[index].quantity
        };
        this.updateCartData(obj);
      }
    }
  }
};
</script>
<style>
.inputQuantity input[type="number"] {
  text-align: center;
  -moz-appearance: textfield;
}
.inputQuantity input::-webkit-outer-spin-button,
.inputQuantity input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
