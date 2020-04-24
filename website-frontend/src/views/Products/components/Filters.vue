<template>
  <v-layout wrap>
    <v-flex xs12 sm12 md12 lg12>
      <span class="title"><v-icon class="mb-1">mdi-view-list</v-icon>Related Categories</span>
      <v-flex xs12 sm12 md12 lg12>
        <v-list dense flat color="transparent">
          <v-list-item-group :value="indexOfItemListByRouteId" mandatory color="primary">
            <v-list-item
              v-for="(item, i) in itemList"
              :key="i"
              @click="onRelatedCategoriesChange(item.id)"
            >
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-flex>
    </v-flex>
    <v-flex xs12 sm12 md12 lg12>
      <v-divider></v-divider>
      <span class="title"><v-icon class="mb-1">mdi-filter</v-icon>Search Filter</span>
      <v-flex xs12 sm12 md12 lg12>
        <v-flex xs12>
          <span>Rating</span>
        </v-flex>
        <v-flex xs12 class="ml-3">
          <v-row align="center" class="mx-0">
            <v-rating
              :value="5"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
          </v-row>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="4"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
            <div class="grey--text">&amp; Up</div>
          </v-row>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="3"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
            <div class="grey--text">&amp; Up</div>
          </v-row>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="2"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
            <div class="grey--text">&amp; Up</div>
          </v-row>
          <v-row align="center" class="mx-0">
            <v-rating
              :value="1"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>
            <div class="grey--text">&amp; Up</div>
          </v-row>
        </v-flex>
      </v-flex>
      <v-flex xs12 sm12 md12 lg12>
        <v-flex xs12>
          <span>Price Range</span>
        </v-flex>
        <v-flex xs12>
          <v-form @submit.prevent="login" ref="form" lazy-validation>
            <v-layout wrap>
              <v-flex xs12 sm12 md6 lg6>
                <v-text-field
                  v-model="price_from"
                  label="₱ Min"
                  type="number"
                  required
                  dense
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md6 lg6>
                <v-text-field
                  v-model="price_to"
                  label="₱ Max"
                  type="number"
                  required
                  dense
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-btn block outlined small color="primary">Search</v-btn>
              </v-flex>
              <v-flex xs12 sm12 md12 lg12>
                <v-btn block outlined small color="error">Reset</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    routeId: Number,
    itemList: Array
  },

  data: () => ({
    price_from: "",
    price_to: ""
  }),

  computed: {
    indexOfItemListByRouteId() {
      return this.itemList.map(item => item.id).indexOf(parseInt(this.routeId));
    }
  },

  methods: {
    onRelatedCategoriesChange(id) {
      this.$emit("onRelatedCategoriesChange", id);
    },
  },
};
</script>
