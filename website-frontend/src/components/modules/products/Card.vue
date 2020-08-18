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
          :src="item.file_path"
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
                  @click="viewDetails(item.id)"
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
                  @click="viewProduct(item.id)"
                >
                  {{ truncateText(item.name, 20) }}
                </span>
              </v-hover>
            </v-card-title>
          </template>
          <span>{{ item.name }}</span>
        </v-tooltip>
        <v-card-text>
          <div class="subtitle-2 font-weight-bold black--text">
            {{ `&#8369; ${item.price_amount}` }}
            <span
              class="line-through grey--text ml-1"
              v-if="item.base_price_amount"
            >
              {{ `&#8369; ${item.base_price_amount}` }}
            </span>
          </div>
          <div
            class="subtitle-2 font-weight-bold blue--text"
            v-if="item.discount_value && item.discount_type"
          >
            {{ setRateTypeValue(item.discount_value, item.discount_type) }}
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

export default {
  props: {
    item: Object,
  },

  mixins: [Mixins],

  components: {
    ProductDetailsModal,
  },

  methods: {
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
