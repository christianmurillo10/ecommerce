<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title>
        <v-icon class="success--text">mdi-cart</v-icon>
        <span class="title success--text">
          Item added to your cart!
        </span>
        <v-spacer></v-spacer>
        <v-icon @click="dialog = false">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md4 lg4>
              <v-img :src="productDetails.file_path" height="150px" />
            </v-flex>
            <v-flex xs12 sm12 md8 lg8>
              <v-container fluid grid-list-xs>
                <v-layout wrap row>
                  <v-flex xs12 sm12 md12 lg12>
                    <span class="title black--text">{{
                      productDetails.name
                    }}</span>
                  </v-flex>
                  <v-flex xs4 sm4 md4 lg4>
                    <span class="body-2 black--text">Option: </span>
                  </v-flex>
                  <v-flex xs8 sm8 md8 lg8>
                    <v-simple-table dense>
                      <template v-slot:default>
                        <tbody>
                          <tr
                            v-for="(option, i) in productDetails.options"
                            :key="i"
                          >
                            <td>{{ option.title }} :</td>
                            <td>{{ option.value }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-flex>
                  <v-flex xs4 sm4 md4 lg4>
                    <span class="body-2 black--text">Quantity: </span>
                  </v-flex>
                  <v-flex xs8 sm8 md8 lg8>
                    <span class="body-2 font-weight-bold black--text">{{
                      productDetails.quantity
                    }}</span>
                  </v-flex>
                  <v-flex xs4 sm4 md4 lg4>
                    <span class="body-2 black--text">Price: </span>
                  </v-flex>
                  <v-flex xs8 sm8 md8 lg8>
                    <span class="body-2 font-weight-bold black--text">{{
                      `&#8369; ${productDetails.price}`
                    }}</span>
                  </v-flex>
                  <v-flex xs4 sm4 md4 lg4>
                    <span class="body-2 black--text">Total Price: </span>
                  </v-flex>
                  <v-flex xs8 sm8 md8 lg8>
                    <span class="body-2 font-weight-bold black--text">{{
                      `&#8369; ${productDetails.total_price}`
                    }}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-flex xs12 sm12 md12 lg12>
          <v-container grid-list-lg>
            <v-layout wrap row>
              <v-flex xs12 sm12 md6 lg6>
                <v-btn
                  block
                  outlined
                  rounded
                  color="blue"
                  class="white--text"
                  to="/cart"
                >
                  <v-icon left dark>mdi-cart</v-icon>VIEW CART
                </v-btn>
              </v-flex>
              <v-flex xs12 sm12 md6 lg6>
                <v-btn
                  block
                  rounded
                  color="blue"
                  class="white--text"
                  @click="dialog = false"
                >
                  <v-icon left dark>mdi-basket</v-icon>CHECKOUT NOW
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    dialog: false,
    productDetails: {
      file_path: "",
      name: "",
      options: [],
      quantity: 0,
      price: 0.0,
      total_price: 0.0,
    },
  }),

  methods: {
    setDialog(value, obj) {
      this.productDetails.file_path = obj.file_path;
      this.productDetails.name = obj.name;
      this.productDetails.options = obj.options;
      this.productDetails.quantity = obj.quantity;
      this.productDetails.price = obj.price;
      this.productDetails.total_price = obj.total_price;
      this.dialog = value;
    },
  },
};
</script>
