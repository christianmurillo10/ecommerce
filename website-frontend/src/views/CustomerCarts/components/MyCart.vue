<template>
  <v-card outlined>
    <v-card-title>MY CART</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-data-table :headers="headers" :items="items" single-expand show-expand>
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
              <v-text-field
                v-model="props.item.quantity"
                type="number"
                class="inputQuantity"
                append-icon="mdi-plus"
                @click:append="increment(props.item.index)"
                prepend-inner-icon="mdi-minus"
                @click:prepend-inner="decrement(props.item.index)"
                @keyup="
                  quantityValueChecker($event.target.value, props.item.index)
                "
                :rules="[rules.required, rules.lessThanOrEqualTo10]"
                required
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small color="error" @click="deleteCartData(item.index)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <table>
              <thead>
                <tr>
                  <th
                    class="text-left"
                    v-for="(option, i) in item.options"
                    :key="i"
                  >
                    {{ option.title }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td v-for="(option, i) in item.options" :key="i">
                    {{ option.value }}
                  </td>
                </tr>
              </tbody>
            </table>
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
      { text: "Price", value: "price", filterable: false, sortable: false },
      {
        text: "Quantity",
        value: "quantity",
        align: "center",
        filterable: false,
        sortable: false,
      },
      {
        text: "Total Price",
        value: "total_price",
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
      if (val < 1) this.items[index].quantity = "";
      else if (val > 10) this.items[index].quantity = 10;
      else this.items[index].quantity = val;

      let obj = {
        index: index,
        quantity: this.items[index].quantity,
      };
      this.updateCartData(obj);
    },
  },
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
