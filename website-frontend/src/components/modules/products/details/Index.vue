<template>
  <v-form ref="form" @submit.prevent="submit" v-model="valid" lazy-validation>
    <v-flex xs12 sm12 md12 lg12>
      <span class="title black--text">{{ details.name }}</span>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12>
      <v-layout row wrap class="mx-0">
        <v-row class="mx-0">
          <v-rating
            :value="4.5"
            color="amber"
            dense
            half-increments
            readonly
            size="14"
          ></v-rating>
          <div class="grey--text ml-1">4.5 (413) Ratings</div>
        </v-row>
      </v-layout>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12 class="pt-2">
      <v-card outlined shaped>
        <v-card-text>
          <div v-if="is_today_deal">
            <v-layout wrap>
              <v-flex xs12 sm12 md12 lg12 text-end>
                <Countdown class="countdown" :endTime="countdownDate" />
              </v-flex>
            </v-layout>
          </div>
          <div>
            <span class="headline font-weight-bold black--text">
              {{ `&#8369; ${priceAmount}` }}
            </span>
          </div>
          <div v-if="is_today_deal">
            <span class="subtitle-1 line-through grey--text">
              {{ `&#8369; ${basePriceAmount}` }}
            </span>
            <span class="subtitle-2 font-weight-bold blue--text ml-2">
              {{ setRateTypeValue(discountValue, discountType) }}
              OFF
            </span>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12 class="pt-2">
      <div v-for="(variant, i) in details.productVariants" :key="i">
        <v-flex xs12 sm12 md12 lg12>
          <span class="body-2 black--text">{{ variant.title }}:</span>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12>
          <v-chip-group mandatory>
            <v-chip
              v-for="(value, j) in JSON.parse(variant.values)"
              :key="j"
              :value="value"
              outlined
              color="blue"
              @click="setVariantValues(i, value)"
            >
              {{ value.name }}
            </v-chip>
          </v-chip-group>
        </v-flex>
      </div>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12>
      <v-container fill-height>
        <v-layout wrap row align-center>
          <v-flex xs12 sm12 md2 lg2>
            <span class="body-2 black--text">Quantity:</span>
          </v-flex>
          <v-flex xs12 sm12 md10 lg10>
            <v-layout row wrap align-center>
              <v-flex xs2 sm2 md2 lg2 text-end>
                <v-btn
                  outlined
                  x-small
                  color="blue"
                  height="40"
                  @click="decrement"
                  :disabled="stock_available === 0 ? true : false"
                >
                  <v-icon>mdi-minus</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs3 sm3 md3 lg3>
                <v-text-field
                  class="product-quantity-input"
                  v-model="formData.quantity"
                  outlined
                  dense
                  type="number"
                  hide-details
                  @keyup="quantityValueChecker($event.target.value)"
                  :rules="[rules.required, rules.lessThanOrEqualTo10]"
                  :disabled="stock_available === 0 ? true : false"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs2 sm2 md2 lg2>
                <v-btn
                  outlined
                  x-small
                  color="blue"
                  height="40"
                  @click="increment"
                  :disabled="stock_available === 0 ? true : false"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-flex>
              <v-flex xs5 sm5 md5 lg5>
                <span v-if="stock_available === 0" class="body-2 red--text">
                  Out of stock
                </span>
                <span v-else class="body-2">
                  {{ `${stock_available} ${details.unit} available` }}
                </span>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12>
      <v-container grid-list-md>
        <v-layout wrap row>
          <v-flex xs12 sm12 md6 lg6>
            <v-btn
              block
              outlined
              rounded
              color="blue"
              class="white--text"
              :disabled="!valid"
            >
              BUY NOW
            </v-btn>
          </v-flex>
          <v-flex xs12 sm12 md6 lg6>
            <v-btn
              block
              rounded
              color="blue"
              class="white--text"
              type="submit"
              :disabled="!valid"
            >
              <v-icon left dark>mdi-cart</v-icon>
              ADD TO CART
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12>
      <AddToCartModal ref="addToCartModal" />
    </v-flex>
  </v-form>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import Countdown from "@/components/utilities/Countdown";
import AddToCartModal from "../modals/AddToCartModal";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";

export default {
  props: {
    isModal: Boolean,
    details: Object,
  },

  mixins: [Mixins],
  components: {
    Countdown,
    AddToCartModal,
  },

  data: () => ({
    is_today_deal: false,
    countdown_date: null,
    price_amount: null,
    base_price_amount: null,
    discount_type: null,
    discount_value: null,
    stock_available: 0,
    formData: {
      variants: [],
      quantity: 1,
    },
    valid: true,
  }),

  mounted() {
    this.getProductFlashDealHeaderDataTodayFlashDeal();
  },

  computed: {
    ...mapGetters("products", ["getProductAvailableStockBySku"]),
    ...mapGetters("customerAuthentication", ["isLoggedIn"]),
    ...mapState("productFlashDealHeaders", [
      "productFlashDealHeaderTodayFlashDeal",
    ]),

    countdownDate() {
      return this.countdown_date;
    },

    priceAmount() {
      const priceAmount = _.isUndefined(this.details.price_amount)
        ? "0.00"
        : this.details.price_amount;
      return this.price_amount ? this.price_amount : priceAmount;
    },

    basePriceAmount() {
      return this.base_price_amount
        ? this.base_price_amount
        : this.details.base_price_amount;
    },

    discountType() {
      return this.discount_type
        ? this.discount_type
        : this.details.discount_type;
    },

    discountValue() {
      return this.discount_value
        ? this.discount_value
        : this.details.discount_value;
    },

    totalPriceAmount() {
      this.formData.total_price_amount =
        this.priceAmount * this.formData.quantity;
      return this.formData.total_price_amount.toFixed(2);
    },
  },

  watch: {
    details(val) {
      this.resetFormData();
      val.productVariants.forEach((element) => {
        let valueArr = JSON.parse(element.values);
        this.formData.variants.push({
          id: element.id,
          title: element.title,
          value: valueArr[0],
        });
      });

      let sku = this.generateSKU();
      this.stock_available = this.getProductAvailableStockBySku(sku);
      this.formData.quantity = 1;

      // enable disable buttons
      if (this.stock_available === 0) {
        this.valid = false;
      } else {
        this.valid = true;
      }
    },

    productFlashDealHeaderTodayFlashDeal(val) {
      const flashDeal = val.productFlashDealDetails.find(
        (val) => val.product_id == this.details.id
      );
      if (flashDeal) {
        this.is_today_deal = true;
        this.countdown_date = val.date_to;
        this.price_amount = flashDeal.current_price_amount;
        this.base_price_amount = flashDeal.base_price_amount;
        this.discount_type = flashDeal.discount_type;
        this.discount_value = flashDeal.discount_value;
      }
    },
  },

  methods: {
    ...mapActions("productFlashDealHeaders", {
      getProductFlashDealHeaderDataTodayFlashDeal: "getDataTodayFlashDeal",
    }),
    ...mapMutations("customerCarts", {
      addCartData: "ADD_DATA",
    }),

    decrement() {
      if (this.formData.quantity > 1) this.formData.quantity--;
    },

    increment() {
      if (
        this.formData.quantity < 10 &&
        this.formData.quantity < this.stock_available
      )
        this.formData.quantity++;
    },

    quantityValueChecker(val) {
      if (val < 1) {
        this.formData.quantity = "";
      } else if (val > 10 && this.stock_available > 10) {
        this.formData.quantity = 10;
      } else if (val > this.stock_available) {
        this.formData.quantity = this.stock_available;
      } else {
        this.formData.quantity = val;
      }
    },

    setVariantValues(key, value) {
      this.formData.variants[key].value = value;
      let sku = this.generateSKU();
      this.stock_available = this.getProductAvailableStockBySku(sku);
      this.formData.quantity = 1;

      // enable disable buttons
      if (this.stock_available === 0) {
        this.valid = false;
      } else {
        this.valid = true;
      }
    },

    generateSKU() {
      let acronymName,
        code = "",
        sku = "";
      this.formData.variants.forEach((element) => {
        code += `-${element.value.code}`;
      });
      sku = this.details.code + code;

      return sku;
    },

    resetFormData() {
      this.formData = {
        variants: [],
        quantity: 1,
      };
    },

    submit() {
      if (this.isLoggedIn) {
        if (this.$refs.form.validate()) {
          let obj = {
            product_id: this.details.id,
            file_path: this.details.productImages[0].file_path,
            name: this.details.name,
            variants: this.formData.variants,
            quantity: this.formData.quantity,
            base_price_amount: this.basePriceAmount,
            price_amount: this.priceAmount,
            discount_type: this.discountType,
            discount_value: this.discountValue,
            total_price_amount: this.totalPriceAmount,
            is_today_deal: this.is_today_deal,
          };
          this.addCartData(obj);
          this.$refs.addToCartModal.setDialog(true, obj);
          if (this.isModal) {
            this.$emit("setProductDetailsDialog", false, null);
          }
        }
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.countdown {
  margin-top: -15px;
}
</style>
