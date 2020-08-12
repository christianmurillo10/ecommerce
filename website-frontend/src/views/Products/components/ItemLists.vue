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
        <v-col
          v-for="item in props.items"
          :key="item.name"
          cols="6"
          sm="4"
          md="3"
          lg="3"
        >
          <v-hover v-slot:default="{ hover }">
            <v-card
              height="335"
              class="mx-auto"
              :class="`elevation-${hover ? 3 : 1}`"
            >
              <v-img
                height="200"
                width="218"
                :src="item.productImages[0].file_path"
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
      visible: 7,
    },
  }),

  mounted() {
    this.setDefault();
  },

  watch: {
    itemCount: function(val) {
      if (!_.isUndefined(val)) this.setDefault();
    },
    "$route.query.page": function(val) {
      if (!_.isUndefined(val) && parseInt(this.$route.query.page) !== 1)
        this.setDefault();
    },
  },

  methods: {
    viewProduct(id) {
      this.$router.push(`/products/${id}`);
    },

    setDefault() {
      this.pagination.page = _.isUndefined(this.$route.query.page)
        ? 1
        : parseInt(this.$route.query.page);
      this.computePaginationLength();
    },

    computePaginationLength() {
      this.pagination.length = Math.ceil(
        this.itemCount / this.pagination.limit
      );
    },

    onPageChange() {
      this.$emit("onPageChange", this.pagination.page);
    },
  },
};
</script>
