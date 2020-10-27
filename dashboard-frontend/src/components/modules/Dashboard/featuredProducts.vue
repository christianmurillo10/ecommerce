<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12 lg12>
      <v-hover>
        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 1}`">
          <v-card-title primary-title>
            <h4 class="title">Featured Products</h4>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="productIsFeaturedList"
              class="elevation-1"
            >
              <template v-slot:items="props">
                <td class="text-xs-left py-1">
                  <v-img
                    :src="props.item.productImages[0].file_path"
                    lazy-src="@/assets/images/no-image.png"
                    height="80"
                    width="120"
                    contain
                  ></v-img>
                </td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.price_amount }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      headers: [
        { text: "Image", value: "", sortable: false },
        { text: "Name", value: "name" },
        { text: "Price Amount", value: "price_amount" },
      ],
    };
  },

  mounted() {
    this.getProductDataByIsFeatured(1);
  },

  computed: {
    ...mapState("products", ["productIsFeaturedList"]),
  },

  methods: {
    ...mapActions("products", {
      getProductDataByIsFeatured: "getDataByIsFeatured",
    }),
  },
};
</script>
