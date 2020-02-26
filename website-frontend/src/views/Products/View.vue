<template>
  <v-container class="col-lg-8 offset-lg-2">
    <v-layout row wrap>
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
                              <v-img :src="productImage" height="300px" />
                            </v-container>
                          </v-layout>
                        </v-container>
                      </v-flex>
                      <v-flex xs12 sm12 md12 lg12>
                        <v-layout row wrap>
                          <v-slide-group class="px-4" show-arrows>
                            <v-slide-item
                              v-for="(productImage, i) in productImagesDetails"
                              :key="i"
                            >
                              <v-container>
                                <v-hover>
                                  <v-img
                                    slot-scope="{ hover }"
                                    :class="`elevation-${hover ? 12 : 2}`"
                                    :src="productImage.file_path"
                                    height="40px"
                                    width="60px"
                                  />
                                </v-hover>
                              </v-container>
                            </v-slide-item>
                          </v-slide-group>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-flex>
                <v-flex xs12 sm12 md7 lg7>
                  <v-flex xs12 sm12 md12 lg12>
                    <v-form ref="form" @submit.prevent="submit" v-model="valid" lazy-validation>
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
                              <v-flex xs6 sm6 md4 lg4>
                                <v-list-item-title>Price:</v-list-item-title>
                              </v-flex>
                              <v-flex xs6 sm6 md8 lg8>
                                <v-list-item-title
                                  class="title"
                                >{{ `&#8369 ${productDataById.price}` }}</v-list-item-title>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-flex xs6 sm6 md4 lg4>
                                <v-list-item-title>Stock:</v-list-item-title>
                              </v-flex>
                              <v-flex xs6 sm6 md8 lg8>
                                <v-list-item-title
                                  class="title"
                                >{{ productDataById.inventories.stock_available }}</v-list-item-title>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-flex xs6 sm6 md4 lg4>
                                <v-list-item-title class="mb-7">Quantity:</v-list-item-title>
                              </v-flex>
                              <v-flex xs6 sm6 md4 lg4>
                                <v-text-field
                                  v-model="formData.quantity"
                                  placeholder
                                  type="number"
                                  outlined
                                  dense
                                  :rules="validateItem.quantityRules"
                                  :min="1"
                                  :max="productDataById.inventories.stock_available"
                                  required
                                ></v-text-field>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-flex xs6 sm6 md4 lg4>
                                <v-list-item-title class="mb-7">Color:</v-list-item-title>
                              </v-flex>
                              <v-flex xs6 sm6 md8 lg8>
                                <v-chip-group v-model="formData.color" item-value="color" mandatory>
                                  <v-chip
                                    v-for="(productImage, i) in productImagesDetails"
                                    :key="i"
                                    :value="productImage.color"
                                    filter
                                    outlined
                                  >{{ productImage.color }}</v-chip>
                                </v-chip-group>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-flex xs6 sm6 md4 lg4>
                                <v-list-item-title>Total Price:</v-list-item-title>
                              </v-flex>
                              <v-flex xs6 sm6 md8 lg8>
                                <v-list-item-title class="title">{{ `&#8369 ${totalPrice}` }}</v-list-item-title>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                          <v-list-item>
                            <v-list-item-content>
                              <v-flex xs12 sm12 md12 lg12>
                                <v-container>
                                  <v-layout row wrap>
                                    <v-btn
                                      color="blue-grey"
                                      outlined
                                      class="ma-2 white--text"
                                      :disabled="!valid"
                                    >BUY NOW</v-btn>
                                    <v-btn
                                      color="blue-grey"
                                      class="ma-2 white--text"
                                      type="submit"
                                      :disabled="!valid"
                                    >
                                      <v-icon left dark>mdi-cart</v-icon>ADD TO CART
                                    </v-btn>

                                    <!-- Dialog for Add to Cart -->
                                    <v-dialog v-model="dialogAddToCart" max-width="800">
                                      <v-card>
                                        <v-card-title class="my-n3">
                                          <v-spacer></v-spacer>
                                          <v-icon @click="dialogAddToCart = false">mdi-close</v-icon>
                                        </v-card-title>
                                        <v-card-title class="display-1 success--text justify-center">
                                          <p>Item added to your cart!</p>
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text>
                                          <v-container>
                                            <v-layout row wrap>
                                              <v-flex xs12 sm12 md4 lg4>
                                                <v-img :src="productImage" height="150px" />
                                              </v-flex>
                                              <v-flex xs12 sm12 md8 lg8>
                                                <v-list-item>
                                                  <v-list-item-content>
                                                    <v-flex xs12 sm12 md12 lg12>
                                                      <v-list-item-title
                                                        class="title"
                                                      >{{ this.productDataById.name }}</v-list-item-title>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md4 lg4>
                                                      <v-list-item-title>Color:</v-list-item-title>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md6 lg6>
                                                      <v-list-item-title
                                                        class="font-weight-bold"
                                                      >{{ formData.color }}</v-list-item-title>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md4 lg4>
                                                      <v-list-item-title>Price:</v-list-item-title>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md6 lg6>
                                                      <v-list-item-title
                                                        class="font-weight-bold"
                                                      >{{ `&#8369${productDataById.price}` }}</v-list-item-title>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md4 lg4>
                                                      <v-list-item-title>Quantity:</v-list-item-title>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md6 lg6>
                                                      <v-list-item-title
                                                        class="font-weight-bold"
                                                      >{{ formData.quantity }}</v-list-item-title>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md4 lg4>
                                                      <v-list-item-title>Total Price:</v-list-item-title>
                                                    </v-flex>
                                                    <v-flex xs12 sm12 md6 lg6>
                                                      <v-list-item-title
                                                        class="font-weight-bold"
                                                      >{{ `&#8369${totalPrice}` }}</v-list-item-title>
                                                    </v-flex>
                                                  </v-list-item-content>
                                                </v-list-item>
                                              </v-flex>
                                            </v-layout>
                                          </v-container>
                                        </v-card-text>
                                        <v-divider></v-divider>
                                        <v-card-actions class="justify-center">
                                          <v-btn
                                            color="blue-grey"
                                            outlined
                                            class="ma-2 white--text"
                                            @click="dialogAddToCart = false"
                                          >
                                            <v-icon left dark>mdi-cart</v-icon>VIEW CART
                                          </v-btn>
                                          <v-btn
                                            color="blue-grey"
                                            class="ma-2 white--text"
                                            @click="dialogAddToCart = false"
                                          >
                                            <v-icon left dark>mdi-basket</v-icon>CHECKOUT NOW
                                          </v-btn>
                                        </v-card-actions>
                                      </v-card>
                                    </v-dialog>
                                    <!-- End of dialog for Add to Cart -->
                                  </v-layout>
                                </v-container>
                              </v-flex>
                              <v-divider></v-divider>
                            </v-list-item-content>
                          </v-list-item>
                        </v-layout>
                      </v-container>
                    </v-form>
                  </v-flex>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  data: () => ({
    dialogAddToCart: false,
    defaultFormData: {
      quantity: 1,
      color: null,
      total_price: 0.0
    },
    formData: {
      quantity: 1,
      color: null,
      total_price: 0.0
    },
    valid: true,
    validateItem: {
      quantityRules: [
        v => !!v || "Quantity is required",
        v => v <= 10 || "Quantity must be less than or equal 10"
      ]
    },
    productImage: null,
    productImagesDetails: null
  }),

  mounted() {
    this.getProductDataById(this.$route.params.id);
  },

  computed: {
    ...mapState("products", ["productDataById"]),
    totalPrice() {
      this.formData.total_price =
        this.productDataById.price * this.formData.quantity;
      return this.formData.total_price.toFixed(2);
    }
  },

  watch: {
    productDataById(val) {
      this.productImage = val.productImages[0].file_path;
      this.productImagesDetails = val.productImages;
    }
  },

  methods: {
    ...mapActions("products", {
      getProductDataById: "getDataById"
    }),
    ...mapMutations("customerCarts", {
      addCartData: "ADD_DATA"
    }),

    submit() {
      if (this.$refs.form.validate()) {
        let obj = {
          id: this.productDataById.id,
          name: this.productDataById.name,
          color: this.formData.color,
          quantity: this.formData.quantity,
          price: this.productDataById.price,
          total_price: this.totalPrice,
          file_path: this.productImage
        };
        this.addCartData(obj);
        this.dialogAddToCart = true;
      }
    }
  }
};
</script>
