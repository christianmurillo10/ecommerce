<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12 lg12>
      <v-hover>
        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 1}`">
          <v-card-title primary-title>
            <h4 class="title">Today Flash Deals</h4>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="productFlashDealTodayFlashDeal.productFlashDealDetails"
              class="elevation-1"
            >
              <template v-slot:items="props">
                <td class="text-xs-left pt-1">
                  <img
                    :src="props.item.products.productImages[0].file_path"
                    height="80"
                    width="120"
                  />
                </td>
                <td>{{ props.item.products.name }}</td>
                <td>{{ props.item.current_price_amount }}</td>
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
      ]
    };
  },

  mounted() {
    this.getCustomerTotalCountByStatusAndIsActive();
  },

  computed: {
    ...mapState("productFlashDeals", ["productFlashDealTodayFlashDeal"])
  },

  methods: {
    ...mapActions("productFlashDeals", { getCustomerTotalCountByStatusAndIsActive: "getDataTodayFlashDeal" })
  }
};
</script>
