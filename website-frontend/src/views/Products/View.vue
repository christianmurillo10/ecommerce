<template>
  <v-container class="col-lg-8 offset-lg-2">
    <v-layout row wrap>
      <v-container>
        <v-flex xs12 sm12 md12 lg12>
          <v-card>
            <v-card-text>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md5 lg5>
                    <v-container>
                      <v-layout row wrap>
                        <v-flex xs12 sm12 md12 lg12>
                          <v-container>
                            <v-layout row wrap>
                              <v-container>
                                <v-img
                                  :src="productDataById.productImages[0].file_path"
                                  height="300px"
                                />
                              </v-container>
                            </v-layout>
                          </v-container>
                        </v-flex>
                        <v-flex xs12 sm12 md12 lg12>
                          <v-container>
                            <v-layout row wrap>
                              <template v-for="(productImages, i) in productDataById.productImages">
                                <v-flex xs2 sm2 md2 lg2 :key="i">
                                  <v-container>
                                    <v-img
                                      :src="productImages.file_path"
                                      height="40px"
                                      width="60px"
                                    />
                                  </v-container>
                                </v-flex>
                              </template>
                            </v-layout>
                          </v-container>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-flex>
                  <v-flex xs12 sm12 md7 lg7>
                    <v-flex xs12 sm12 md12 lg12>
                      <v-container>
                        <v-layout row wrap>
                          <v-list-item two-line>
                            <v-list-item-content>
                              <v-list-item-title class="headline">{{ productDataById.name }}</v-list-item-title>
                              <v-list-item-subtitle>
                                <v-row align="center" class="mx-0">
                                  <v-rating
                                    :value="0"
                                    color="amber"
                                    dense
                                    half-increments
                                    readonly
                                    size="14"
                                  ></v-rating>
                                  <div class="grey--text ml-2">(0 customer reviews)</div>
                                </v-row>
                              </v-list-item-subtitle>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-flex xs6 sm6 md2 lg2>
                                <v-list-item-title>Price:</v-list-item-title>
                              </v-flex>
                              <v-flex xs6 sm6 md3 lg3>
                                <v-list-item-title
                                  class="title"
                                >{{ `&#8369 ${productDataById.price}` }}</v-list-item-title>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-flex xs6 sm6 md2 lg2>
                                <v-list-item-title>Stock:</v-list-item-title>
                              </v-flex>
                              <v-flex xs6 sm6 md3 lg3>
                                <v-list-item-title
                                  class="title"
                                >{{ productDataById.inventories.stock_available }}</v-list-item-title>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-flex xs6 sm6 md2 lg2>
                                <v-list-item-title class="mb-7">Quantity:</v-list-item-title>
                              </v-flex>
                              <v-flex xs6 sm6 md3 lg3>
                                <v-text-field placeholder type="number" outlined dense></v-text-field>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-flex xs6 sm6 md2 lg2>
                                <v-list-item-title>Total Price:</v-list-item-title>
                              </v-flex>
                              <v-flex xs6 sm6 md3 lg3>
                                <v-list-item-title class="title">{{ `&#8369 0` }}</v-list-item-title>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-flex xs6 sm6 md2 lg2>
                                <v-btn color="blue-grey" outlined class="ma-2 white--text">BUY NOW</v-btn>
                              </v-flex>
                              <v-flex xs6 sm6 md2 lg2>
                                <v-btn color="blue-grey" class="ma-2 white--text">
                                  <v-icon left dark>mdi-cart</v-icon>ADD TO CART
                                </v-btn>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                        </v-layout>
                      </v-container>
                    </v-flex>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({}),

  mounted() {
    this.getProductDataById(this.$route.params.id);
  },

  computed: {
    ...mapState("products", ["productDataById"])
  },

  watch: {},

  methods: {
    ...mapActions("products", {
      getProductDataById: "getDataById"
    })
  }
};
</script>
