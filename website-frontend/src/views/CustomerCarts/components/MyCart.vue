<template>
  <v-card>
    <v-card-title>MY CART</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Image</th>
              <th class="text-left">Product</th>
              <th class="text-left">Price</th>
              <th class="text-center">Quantity</th>
              <th class="text-left">Total Price</th>
              <th class="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.index">
              <td class="py-1">
                <router-link v-bind:to="`/products/${item.product_id}`">
                  <v-img :src="item.file_path" max-width="100px"></v-img>
                </router-link>
              </td>
              <td>
                <v-menu open-on-hover offset-x :nudge-width="200">
                  <template v-slot:activator="{ on }">
                    <span v-on="on">{{ item.name }}</span>
                  </template>
                  <v-card>
                    <v-card-title>Options</v-card-title>
                    <v-card-text>
                      <v-simple-table dense>
                        <template v-slot:default>
                          <tbody>
                            <tr v-for="(option, i) in item.options" :key="i">
                              <td>{{ option.title }}</td>
                              <td>{{ option.value }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </td>
              <td class="text-right">{{ `&#8369 ${item.price}` }}</td>
              <td class="text-center" width="200px">
                <v-text-field
                  v-model="item.quantity"
                  type="number"
                  class="inputQuantity mt-2 mb-n4"
                  append-icon="mdi-plus"
                  @click:append="increment(item.index)"
                  prepend-inner-icon="mdi-minus"
                  @click:prepend-inner="decrement(item.index)"
                  @keyup="quantityValueChecker($event.target.value)"
                  :rules="[rules.required, rules.lessThanOrEqualTo10]"
                  dense
                  required
                ></v-text-field>
              </td>
              <td class="text-right">{{ `&#8369 ${item.total_price}` }}</td>
              <td class="text-center">
                <v-icon small color="error" @click="deleteCartData(item.index)">mdi-delete</v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
  </v-card>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapMutations } from "vuex";

export default {
  props: {
    items: Array
  },

  mixins: [Mixins],

  data: () => ({ }),

  methods: {
    ...mapMutations("customerCarts", {
      updateCartData: "UPDATE_DATA"
    }),
    ...mapMutations("customerCarts", {
      deleteCartData: "DELETE_DATA"
    }),

    decrement(index) {
      if (this.items[index].quantity > 1) {
        this.items[index].quantity--;
        let obj = {
          index: index,
          quantity: this.items[index].quantity
        };
        this.updateCartData(obj);
      }
    },
    increment(index) {
      if (this.items[index].quantity < 10) {
        this.items[index].quantity++;
        let obj = {
          index: index,
          quantity: this.items[index].quantity
        };
        this.updateCartData(obj);
      }
    },

    quantityValueChecker(val) {
      if (val < 1) this.formData.quantity = "";
      else if (val > 10) this.formData.quantity = 10;
      else this.formData.quantity = val;
    }
  }
}
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