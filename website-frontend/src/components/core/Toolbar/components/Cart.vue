<template>
  <v-menu
    content-class="blue-border"
    v-model="cart"
    :close-on-content-click="false"
    :nudge-width="200"
    offset-y
    left
    transition="slide-x-reverse-transition"
  >
    <template v-slot:activator="{ on: { click } }">
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on:click="click" v-on="on">
            <v-badge
              color="blue"
              :content="
                isLoggedIn && customerCartList.length !== 0
                  ? customerCartList.length
                  : '0'
              "
            >
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </v-btn>
        </template>
        <span>Cart</span>
      </v-tooltip>
    </template>
    <v-card width="350" v-if="isLoggedIn && customerCartList.length !== 0">
      <v-layout row wrap justify-center>
        <v-card-title class="title blue--text">Cart Items</v-card-title>
      </v-layout>
      <v-divider></v-divider>
      <v-card-text class="pa-0">
        <v-simple-table fixed-header height="200px">
          <template v-slot:default>
            <tbody>
              <tr v-for="item in customerCartList" :key="item.index">
                <td>
                  <router-link v-bind:to="`/products/${item.product_id}`">
                    <v-img
                      :src="item.file_path"
                      max-height="60px"
                      max-width="60px"
                    ></v-img>
                  </router-link>
                </td>
                <td>
                  <v-row class="font-weight-medium">{{ item.name }}</v-row>
                  <v-row>
                    {{ `x${item.quantity} &#8369; ${item.total_price}` }}
                  </v-row>
                </td>
                <td class="justify-center">
                  <v-icon
                    small
                    color="error"
                    @click="deleteCartData(item.index)"
                  >
                    mdi-delete
                  </v-icon>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-subtitle class="mx-10 mb-n5">
        <v-layout row wrap>
          <v-layout>
            <p class="font-weight-medium">Subtotal</p>
          </v-layout>
          <v-layout justify-end>
            <p class="font-weight-medium">
              {{ `&#8369; ${getCustomerCartTotalPrice}` }}
            </p>
          </v-layout>
        </v-layout>
      </v-card-subtitle>
      <v-divider></v-divider>
      <v-layout row wrap justify-center>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn small color="blue" outlined class="ma-2" to="/cart">
            <v-icon left>mdi-cart</v-icon>VIEW CART
          </v-btn>
          <v-btn
            small
            color="blue"
            class="ma-2 white--text"
            @click="cart = false"
          >
            <v-icon left>mdi-basket</v-icon>CHECKOUT
          </v-btn>
        </v-card-actions>
      </v-layout>
    </v-card>
    <v-card width="400" v-else-if="!isLoggedIn">
      <v-layout row wrap justify-center>
        <v-card-title class="subtitle-2">
          <span>
            You haven't login. please
            <router-link v-bind:to="'/login'">login</router-link>.
          </span>
        </v-card-title>
      </v-layout>
    </v-card>
    <v-card width="400" v-else>
      <v-layout row wrap justify-center>
        <v-card-title class="subtitle-2">Your Cart is empty!</v-card-title>
      </v-layout>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  data: () => ({
    cart: false,
  }),

  mounted() {
    this.setCardData();
  },

  computed: {
    ...mapState("customerCarts", ["customerCartList"]),
    ...mapGetters("customerCarts", ["getCustomerCartTotalPrice"]),
    ...mapGetters("customerAuthentication", ["isLoggedIn"]),
  },

  methods: {
    ...mapMutations("customerCarts", {
      deleteCartData: "DELETE_DATA",
      setCardData: "SET_DATA",
    }),
  },
};
</script>
