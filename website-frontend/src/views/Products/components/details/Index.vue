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
      <v-card outlined>
        <v-card-text>
          <span class="headline font-weight-bold black--text">{{
            `&#8369; ${
              details.price_amount === undefined ? "0.00" : details.price_amount
            }`
          }}</span>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12 class="pt-2">
      <div v-for="(option, i) in details.productOptions" :key="i">
        <v-flex xs12 sm12 md12 lg12>
          <span class="body-2 black--text">{{ option.title }}:</span>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12>
          <v-chip-group mandatory>
            <v-chip
              v-for="(value, j) in option.values.split(',')"
              :key="j"
              :value="value"
              outlined
              color="blue"
              @click="setOptionValues(i, value)"
              >{{ value }}</v-chip
            >
          </v-chip-group>
        </v-flex>
      </div>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12>
      <v-container fill-height>
        <v-layout wrap row align-center>
          <v-flex xs12 sm12 md3 lg3>
            <span class="body-2 black--text">Quantity:</span>
          </v-flex>
          <v-flex xs7 sm7 md3 lg3>
            <v-text-field
              v-model="formData.quantity"
              placeholder
              type="number"
              class="inputQuantity"
              append-icon="mdi-plus"
              @click:append="increment"
              prepend-inner-icon="mdi-minus"
              @click:prepend-inner="decrement"
              @keyup="quantityValueChecker($event.target.value)"
              :rules="[rules.required, rules.lessThanOrEqualTo10]"
              :disabled="stockAvailable === 0 ? true : false"
              dense
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs4 sm4 md5 lg5 offset-xs1 offset-sm1 offset-md1 offset-lg1>
            <span v-if="stockAvailable === 0" class="body-2 red--text"
              >Out of stock</span
            >
            <span v-else class="body-2">{{
              `${stockAvailable} ${details.unit} available`
            }}</span>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12>
      <v-layout wrap row>
        <v-flex xs12 sm12 md6 lg6>
          <v-btn
            block
            outlined
            color="blue"
            class="ma-1 white--text"
            :disabled="!valid"
            >BUY NOW</v-btn
          >
        </v-flex>
        <v-flex xs12 sm12 md6 lg6>
          <v-btn
            block
            color="blue"
            class="ma-1 white--text"
            type="submit"
            :disabled="!valid"
          >
            <v-icon left dark>mdi-cart</v-icon>ADD TO CART
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12>
      <AddToCartModal ref="addToCartModal" />
    </v-flex>
  </v-form>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import AddToCartModal from "../modals/AddToCartModal";
import { mapGetters, mapMutations } from "vuex";

export default {
  props: {
    details: Object,
  },

  mixins: [Mixins],
  components: {
    AddToCartModal,
  },

  data: () => ({
    stockAvailable: 0,
    formData: {
      options: [],
      quantity: 1,
    },
    valid: true,
  }),

  computed: {
    ...mapGetters("products", ["getProductAvailableStockBySku"]),
    ...mapGetters("customerAuthentication", ["isLoggedIn"]),
    totalPrice() {
      this.formData.total_price =
        this.details.price_amount * this.formData.quantity;
      return this.formData.total_price.toFixed(2);
    },
  },

  watch: {
    details(val) {
      val.productOptions.forEach((element) => {
        let valueArr = element.values.split(",");
        this.formData.options.push({
          id: element.id,
          title: element.title,
          value: valueArr[0],
        });
      });

      let sku = this.generateSKU();
      this.stockAvailable = this.getProductAvailableStockBySku(sku);
      this.formData.quantity = 1;

      // enable disable buttons
      if (this.stockAvailable === 0) this.valid = false;
      else this.valid = true;
    },
  },

  methods: {
    ...mapMutations("customerCarts", {
      addCartData: "ADD_DATA",
    }),

    decrement() {
      if (this.formData.quantity > 1) this.formData.quantity--;
    },

    increment() {
      if (
        this.formData.quantity < 10 &&
        this.formData.quantity < this.stockAvailable
      )
        this.formData.quantity++;
    },

    quantityValueChecker(val) {
      if (val < 1) this.formData.quantity = "";
      else if (val > 10 && this.stockAvailable > 10)
        this.formData.quantity = 10;
      else if (val > this.stockAvailable)
        this.formData.quantity = this.stockAvailable;
      else this.formData.quantity = val;
    },

    setOptionValues(key, value) {
      this.formData.options[key].value = value;
      let sku = this.generateSKU();
      this.stockAvailable = this.getProductAvailableStockBySku(sku);
      this.formData.quantity = 1;

      // enable disable buttons
      if (this.stockAvailable === 0) this.valid = false;
      else this.valid = true;
    },

    generateSKU() {
      let acronymName,
        code = "",
        sku = "";
      this.formData.options.forEach((element) => {
        code += `-${element.value.toUpperCase()}`;
      });

      acronymName = this.details.name
        .match(/\b(\w)/g)
        .join("")
        .toUpperCase();
      sku = acronymName + code;

      return sku;
    },

    submit() {
      if (this.isLoggedIn) {
        if (this.$refs.form.validate()) {
          let obj = {
            product_id: this.details.id,
            file_path: this.details.productImages[0].file_path,
            name: this.details.name,
            options: this.formData.options,
            quantity: this.formData.quantity,
            price: this.details.price_amount,
            total_price: this.totalPrice,
          };
          this.addCartData(obj);
          this.$refs.addToCartModal.setDialog(true, obj);
        }
      } else {
        this.$router.push("/login");
      }
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
