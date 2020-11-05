<template>
  <v-card flat>
    <v-card-title>MY CART</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="items"
        item-key="index"
        single-expand
        show-expand
      >
        <template v-slot:top>
          <v-toolbar dense flat>
            <v-spacer></v-spacer>
            <span class="font-italic red--text">
              NOTE: Click "Quantity" value to update.
            </span>
          </v-toolbar>
        </template>
        <template v-slot:item.file_path="{ item }">
          <router-link v-bind:to="`/products/${item.product_id}`">
            <v-img :src="item.file_path" max-width="100px"></v-img>
          </router-link>
        </template>
        <template v-slot:item.quantity="props">
          <v-edit-dialog>
            {{ props.item.quantity }}
            <template v-slot:input>
              <v-container>
                <v-layout wrap>
                  <v-flex xs3 sm3 md3 lg3 text-end>
                    <v-btn
                      outlined
                      x-small
                      color="blue"
                      height="40"
                      @click="decrement(props.item.index)"
                    >
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </v-flex>
                  <v-flex xs6 sm6 md6 lg6>
                    <v-text-field
                      class="product-quantity-input"
                      v-model="props.item.quantity"
                      outlined
                      dense
                      type="number"
                      hide-details
                      @keyup="
                        quantityValueChecker(
                          $event.target.value,
                          props.item.index
                        )
                      "
                      :rules="[rules.required, rules.lessThanOrEqualTo10]"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs3 sm3 md3 lg3>
                    <v-btn
                      outlined
                      x-small
                      color="blue"
                      height="40"
                      @click="increment(props.item.index)"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small color="error" @click="deleteCartData(item.index)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="py-1">
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>Base Price</th>
                    <th>Discount</th>
                    <th
                      class="text-left"
                      v-for="(variant, i) in item.variants"
                      :key="i"
                    >
                      {{ variant.title }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{ item.base_price_amount }}</td>
                    <td>
                      {{
                        setRateTypeValue(
                          item.discount_value,
                          item.discount_type
                        )
                      }}
                    </td>
                    <td v-for="(variant, i) in item.variants" :key="i">
                      {{ variant.value.name }}
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapMutations } from "vuex";

export default {
  props: {
    items: Array,
  },

  mixins: [Mixins],

  data: () => ({
    headers: [
      { text: "Image", value: "file_path", filterable: false, sortable: false },
      { text: "Item", value: "name", filterable: false },
      {
        text: "Price",
        value: "price_amount",
        filterable: false,
        sortable: false,
      },
      {
        text: "Quantity",
        value: "quantity",
        align: "center",
        filterable: false,
        sortable: false,
      },
      {
        text: "Total Price",
        value: "total_price_amount",
        filterable: false,
        sortable: false,
      },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        filterable: false,
        sortable: false,
      },
      {
        text: "",
        value: "data-table-expand",
        filterable: false,
        sortable: false,
      },
    ],
  }),

  methods: {
    ...mapMutations("customerCarts", {
      updateCartData: "UPDATE_DATA",
    }),
    ...mapMutations("customerCarts", {
      deleteCartData: "DELETE_DATA",
    }),

    decrement(index) {
      if (this.items[index].quantity > 1) {
        this.items[index].quantity--;
        let obj = {
          index: index,
          quantity: this.items[index].quantity,
        };
        this.updateCartData(obj);
      }
    },

    increment(index) {
      if (this.items[index].quantity < 10) {
        this.items[index].quantity++;
        let obj = {
          index: index,
          quantity: this.items[index].quantity,
        };
        this.updateCartData(obj);
      }
    },

    quantityValueChecker(val, index) {
      if (val < 1) {
        this.items[index].quantity = 1;
      } else if (val > 10) {
        this.items[index].quantity = 10;
      } else {
        this.items[index].quantity = val;
      }

      let obj = {
        index: index,
        quantity: this.items[index].quantity,
      };
      this.updateCartData(obj);
    },
  },
};
</script>
