<template>
  <v-container class="col-lg-10 offset-lg-1">
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-container>
          <v-layout row wrap>
            <v-flex xs12 sm12 md8 lg8>
              <v-container>
                <v-card>
                  <v-card-title>My Cart</v-card-title>

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
                              <v-img :src="item.file_path" max-width="100px"></v-img>
                            </td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.color }}</td>
                            <td>{{ `&#8369${item.price}` }}</td>
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
                              ></v-text-field>
                            </td>
                            <td>{{ `&#8369${item.total_price}` }}</td>
                            <td class="text-center">
                              <v-icon small @click="deleteItem(item.id)">mdi-delete</v-icon>
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
                  <v-card-title>FILTERS</v-card-title>

                  <v-divider class="mx-4"></v-divider>
                  <v-card-title>Rating</v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="5" color="amber" dense half-increments readonly size="14"></v-rating>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="4" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="3" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="2" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
                      <v-row align="center" class="mx-0">
                        <v-rating :value="1" color="amber" dense half-increments readonly size="14"></v-rating>
                        <div class="grey--text">&amp; Up</div>
                      </v-row>
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
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({}),

  mounted() {},

  computed: {
    ...mapState("customerCarts", ["customerCartList"])
  },

  methods: {
    ...mapMutations("customerCarts", {
      updateCartData: "UPDATE_DATA"
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
