<template>
  <v-data-iterator
    :items="items"
    :items-per-page.sync="pagination.limit"
    hide-default-footer
  >
    <template v-slot:header>
      <div class="title">
        Results for
        <b>"{{ header }}"</b>
        ({{ itemCount }})
      </div>
      <v-row>
        <v-spacer></v-spacer>
        <div>
          <v-pagination
            v-model="pagination.page"
            :key="`${pagination.length}${pagination.page}`"
            :length="pagination.length"
            :total-visible="pagination.visible"
            :disabled="pagination.length === 1 ? true : false"
            @input="onPageChange"
          ></v-pagination>
        </div>
      </v-row>
    </template>
    <template v-slot:default="props">
      <v-row dense>
        <v-col v-for="item in props.items" :key="item.name" cols="6" sm="4" md="3" lg="3">
          <v-hover>
            <v-card rounded class="product-card" slot-scope="{ hover }" :class="`elevation-${hover ? 3 : 0}`">
              <v-container fluid>
                <v-img class="product-image" :src="item.productImages[0].file_path" lazy-src="@/assets/images/no-image.png" @click="viewProduct(item.id)" />
                <v-container fluid>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <div v-on="on" class="caption black--text">
                        {{ truncateText(item.name, 20) }}
                      </div>
                    </template>
                    <span>{{ item.name }}</span>
                  </v-tooltip>
                  <div class="subtitle-2 font-weight-bold black--text">
                    {{ `&#8369; ${item.price_amount}` }}
                  </div>
                  <v-row class="mx-0">
                    <v-rating :value="4.5" color="amber" dense half-increments readonly size="14"
                    ></v-rating>
                    <div class="subtitle-2 grey--text">4.5 (413)</div>
                  </v-row>
                </v-container>
              </v-container>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </template>
    <template v-slot:footer>
      <v-row>
        <v-spacer></v-spacer>
        <div>
          <v-pagination
            v-model="pagination.page"
            :key="`${pagination.length}${pagination.page}`"
            :length="pagination.length"
            :total-visible="pagination.visible"
            :disabled="pagination.length === 1 ? true : false"
            @input="onPageChange"
          ></v-pagination>
        </div>
      </v-row>
    </template>
    <template v-slot:no-data>
      <p class="justify-center layout px-0">No data found!</p>
    </template>
  </v-data-iterator>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";

export default {
  props: {
    header: String,
    items: Array,
    itemCount: Number,
  },
  mixins: [Mixins],

  data: () => ({
    pagination: {
      limit: 60,
      page: 1,
      length: 1,
      visible: 7
    }
  }),

  mounted() {
    this.setDefault();
  },

  watch: {
    "itemCount": function (val) {
      if (!_.isUndefined(val)) this.setDefault();
    },
    "$route.params.page": function (val) {
      if (!_.isUndefined(val) && parseInt(this.$route.params.page) !== 1) this.setDefault();
    }
  },

  methods: {
    viewProduct(id) {
      this.$router.push(`/products/${id}`);
    },

    setDefault() {
      this.pagination.page = parseInt(this.$route.params.page);
      this.computePaginationLength();
    },

    computePaginationLength() {
      this.pagination.length =  Math.ceil(this.itemCount / this.pagination.limit);
    },

    onPageChange() {
      this.$emit("onPageChange", this.pagination.page);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/product-items.scss';
</style>