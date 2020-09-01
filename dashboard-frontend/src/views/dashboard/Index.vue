<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm12 md8 lg8>
        <ProductParameters />
      </v-flex>
      <v-flex xs12 sm12 md4 lg4>
        <CountMonitoring />
      </v-flex>
      <v-flex xs12 sm12 md6 lg6>
        <FeaturedProducts />
      </v-flex>
      <v-flex xs12 sm12 md6 lg6>
        <TodayFlashDeals />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ProductParameters from "@/components/modules/Dashboard/productParameters"
import CountMonitoring from "@/components/modules/Dashboard/countMonitoring"
import FeaturedProducts from "@/components/modules/Dashboard/featuredProducts"
import TodayFlashDeals from "@/components/modules/Dashboard/todayFlashDeals"


export default {
  components: {
    ProductParameters,
    CountMonitoring,
    FeaturedProducts,
    TodayFlashDeals
  },

  data: () => ({}),

  mounted() {},

  computed: {},

  methods: {}
}
</script>