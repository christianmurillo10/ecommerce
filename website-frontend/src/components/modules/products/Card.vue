<template>
  <div>
    <v-hover v-slot:default="{ hover }">
      <v-card
        height="335"
        class="mx-auto"
        :class="`elevation-${hover ? 3 : 1}`"
      >
        <v-img
          height="200"
          :src="productDetails.file_path"
          lazy-src="@/assets/images/no-image.png"
        >
          <v-expand-transition>
            <v-row
              class="fill-height pa-2 transition-fast-in-fast-out grey darken-3 v-card--reveal"
              align="end"
              v-if="hover"
            >
              <v-col align="end">
                <v-btn rounded x-small color="white" class="red--text">
                  <v-icon small>mdi-heart</v-icon>
                </v-btn>
                <v-btn
                  rounded
                  x-small
                  color="white"
                  class="blue--text"
                  @click="viewDetails(productDetails.id)"
                >
                  <v-icon small>mdi-cart</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-expand-transition>
        </v-img>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-card-title>
              <v-hover v-slot:default="{ hover }">
                <span
                  v-on="on"
                  :class="
                    `caption cursor-pointer ${
                      hover ? 'blue--text' : 'black--text'
                    }`
                  "
                  @click="viewProduct(productDetails.id)"
                >
                  {{ truncateText(productDetails.name, 20) }}
                </span>
              </v-hover>
            </v-card-title>
          </template>
          <span>{{ productDetails.name }}</span>
        </v-tooltip>
        <v-card-text>
          <div class="subtitle-2 font-weight-bold black--text">
            {{ `&#8369; ${priceAmount}` }}
            <span class="line-through grey--text ml-1" v-if="basePriceAmount">
              {{ `&#8369; ${basePriceAmount}` }}
            </span>
          </div>
          <div
            class="subtitle-2 font-weight-bold blue--text"
            v-if="discountValue && discountType"
          >
            {{ setRateTypeValue(discountValue, discountType) }}
            OFF
          </div>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="4.5"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
            <div class="grey--text ml-4">4.5 (413)</div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-hover>
    <ProductDetailsModal ref="productDetailsModal" />
  </div>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import ProductDetailsModal from "./modals/DetailsModal";
import { mapState } from "vuex";

export default {
  props: {
    item: Object,
  },

  mixins: [Mixins],

  components: {
    ProductDetailsModal,
  },

  data: () => ({
    productDetails: null,
    price_amount: null,
    base_price_amount: null,
    discount_type: null,
    discount_type: null,
  }),

  created() {
    this.initialLoad();
  },

  computed: {
    ...mapState("productFlashDealHeaders", [
      "productFlashDealHeaderTodayFlashDeal",
    ]),

    priceAmount() {
      return this.price_amount ? this.price_amount : this.productDetails.price_amount;
    },

    basePriceAmount() {
      return this.base_price_amount ? this.base_price_amount : this.productDetails.base_price_amount;
    },

    discountType() {
      return this.discount_type ? this.discount_type : this.productDetails.discount_type;
    },

    discountValue() {
      return this.discount_value ? this.discount_value : this.productDetails.discount_value;
    },
  },

  watch: {
    productFlashDealHeaderTodayFlashDeal(val) {
      if (val && this.item.type !== "flashDeal") {
        const flashDeal = val.productFlashDealDetails.find(val => val.product_id == this.item.id);
        if (flashDeal) {
          this.price_amount = flashDeal.current_price_amount;
          this.base_price_amount = flashDeal.base_price_amount;
          this.discount_type = flashDeal.discount_type;
          this.discount_value = flashDeal.discount_value;
        }
      }
    },
  },

  methods: {
    initialLoad() {
      this.productDetails = this.item;
    },

    viewProduct(id) {
      this.$router.push(`/products/${id}`);
    },

    viewDetails(id) {
      this.$refs.productDetailsModal.setDialog(true, id);
    },
  },
};
</script>

<style lang="scss" scoped>
.v-card--reveal {
  opacity: 0.8;
}
</style>
