<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12 lg12>
      <v-toolbar flat dense class="hidden-sm-and-down">
        <v-container class="col-lg-10 offset-lg-1">
          <v-layout row wrap>
            <v-flex xs12 sm12 md6 lg6>
              <v-layout>
                <p class="font-weight-medium subtitle-2 my-1">Follow us on</p>
                <v-btn icon small>
                  <v-icon>mdi-facebook</v-icon>
                </v-btn>
                <v-btn icon small>
                  <v-icon>mdi-instagram</v-icon>
                </v-btn>
              </v-layout>
            </v-flex>
            <v-flex xs12 sm12 md6 lg6>
              <v-layout justify-end>
                <v-btn text small>Track My Order</v-btn>
                <v-btn text small>Login</v-btn>
                <v-btn text small>Registration</v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-toolbar>
      <v-toolbar>
        <v-container class="col-lg-10 offset-lg-1">
          <v-layout row wrap>
            <v-flex xs4 sm4 md4 lg4>
              <v-layout justify-start>
                <v-app-bar-nav-icon @click.stop="setPrimaryDrawerModel(!primaryDrawer.model)" />
                <router-link to="/">
                  <v-img :src="avatar" max-height="50px" max-width="50px"></v-img>
                </router-link>
              </v-layout>
            </v-flex>
            <v-flex xs4 sm4 md4 lg4>
              <v-form ref="form" @submit.prevent="search">
                <v-layout row wrap>
                  <v-text-field
                    v-model="keywords"
                    flat
                    outlined
                    hide-details
                    clearable
                    dense
                    placeholder="Search"
                    class="hidden-sm-and-down"
                  />
                  <v-btn outlined color="grey" height="40px" type="submit">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </v-layout>
              </v-form>
            </v-flex>
            <v-flex xs4 sm4 md4 lg4>
              <v-layout justify-end>
                <v-tooltip right>
                  <template v-slot:activator="onTooltip">
                    <v-btn icon v-on="onTooltip.on">
                      <v-badge color="red" content="0">
                        <v-icon>mdi-heart</v-icon>
                      </v-badge>
                    </v-btn>
                  </template>
                  <span>Wishlist</span>
                </v-tooltip>
                <v-menu
                  v-model="cart"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-y
                  transition="slide-x-reverse-transition"
                >
                  <template v-slot:activator="{ on: { click } }">
                    <v-tooltip right>
                      <template v-slot:activator="{ on }">
                        <v-btn icon v-on:click="click" v-on="on">
                          <v-badge
                            color="green"
                            :content="customerCartList.length !== 0 ? customerCartList.length : '0'"
                          >
                            <v-icon>mdi-cart</v-icon>
                          </v-badge>
                        </v-btn>
                      </template>
                      <span>Cart</span>
                    </v-tooltip>
                  </template>

                  <v-card width="350" v-if="customerCartList.length !== 0">
                    <v-layout row wrap justify-center>
                      <v-card-title class="title">Cart Items</v-card-title>
                    </v-layout>

                    <v-divider></v-divider>

                    <v-card-text class="pa-0">
                      <v-simple-table fixed-header height="200px">
                        <template v-slot:default>
                          <tbody>
                            <tr v-for="item in customerCartList" :key="item.index">
                              <td>
                                <v-img :src="item.file_path" max-height="60px" max-width="60px"></v-img>
                              </td>
                              <td>
                                <v-row class="font-weight-medium">{{ item.name }}</v-row>
                                <v-row>{{ `x${item.quantity} &#8369${item.total_price}` }}</v-row>
                              </td>
                              <td class="justify-center">
                                <v-icon small @click="deleteCartData(item.index)">mdi-delete</v-icon>
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
                          <p class="font-weight-medium">{{ `&#8369${getCustomerCartTotalPrice}` }}</p>
                        </v-layout>
                      </v-layout>
                    </v-card-subtitle>

                    <v-divider></v-divider>

                    <v-layout row wrap justify-center>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          small
                          color="blue-grey"
                          outlined
                          class="ma-2 white--text"
                          @click="cart = false"
                        >
                          <v-icon left dark>mdi-cart</v-icon>VIEW CART
                        </v-btn>
                        <v-btn
                          small
                          color="blue-grey"
                          class="ma-2 white--text"
                          @click="cart = false"
                        >
                          <v-icon left dark>mdi-basket</v-icon>CHECKOUT
                        </v-btn>
                      </v-card-actions>
                    </v-layout>
                  </v-card>
                  <v-card width="400" v-else>
                    <v-layout row wrap justify-center>
                      <v-card-title class="title">Your Cart is empty!</v-card-title>
                    </v-layout>
                  </v-card>
                </v-menu>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-toolbar>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    keywords: "",
    cart: false
  }),
  computed: {
    ...mapState("appbar", ["primaryDrawer"]),
    ...mapState("customerCarts", ["customerCartList"]),
    ...mapGetters("customerCarts", ["getCustomerCartTotalPrice"]),
    ...mapState("products", ["productSearchKeyword"]),
    avatar() {
      return "/img/logo.png";
    }
  },
  methods: {
    ...mapActions("appbar", ["setPrimaryDrawerModel"]),
    ...mapMutations("products", {
      setProductSearchKeyword: "SET_DATA_SEARCH_KEYWORD"
    }),
    ...mapMutations("customerCarts", {
      deleteCartData: "DELETE_DATA"
    }),

    search() {
      if (this.$refs.form.validate()) {
        if (
          !_.isEmpty(this.keywords) &&
          this.productSearchKeyword !== this.keywords
        ) {
          this.setProductSearchKeyword(this.keywords);
          this.$router.push(`/search/${this.keywords}/page/1`);
        }
      }
    }
  }
};
</script>