<template>
  <v-hover v-slot:default="{ hover }">
    <v-card height="335" class="mx-auto" :class="`elevation-${hover ? 3 : 1}`">
      <v-img
        height="200"
        width="218"
        :src="item.file_path"
        lazy-src="@/assets/images/no-image.png"
      >
        <v-row class="pa-2" v-if="hover">
          <v-col>
            <div>
              <v-btn icon color="red" class="white--text" x-small top>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </div>
            <div>
              <v-btn icon color="blue" class="white--text" x-small top>
                <v-icon>mdi-cart</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
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
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
export default {
  props: {
    item: Object,
  },
  mixins: [Mixins],

  methods: {
    viewProduct(id) {
      this.$router.push(`/products/${id}`);
    },
  },
};
</script>
