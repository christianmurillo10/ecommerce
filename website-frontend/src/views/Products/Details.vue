<template>
  <v-layout wrap>
    <v-container class="content">
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>
          <v-layout wrap>
            <v-flex xs12 sm12 md5 lg5>
              <v-container>
                <Gallery :images="productDataById.productImages" />
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md7 lg7>
              <v-container>
                <Index :details="productDataById" />
              </v-container>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex xs12 sm12 md9 lg9>
                <v-flex xs12 sm12 md12 lg12>
                  <Description :details="productDataById" />
                </v-flex>
                <v-flex xs12 sm12 md12 lg12>
                  <v-card outlined>
                    <v-card-title class="blue--text"
                      >Ratings & Reviews</v-card-title
                    >
                  </v-card>
                </v-flex>
              </v-flex>
              <v-flex xs12 sm12 md3 lg3>
                <v-flex xs12 sm12 md12 lg12>
                  <v-card outlined>
                    <v-card-title class="blue--text">
                      Sponsored Products
                    </v-card-title>
                  </v-card>
                </v-flex>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import Gallery from "./components/details/Gallery";
import Index from "./components/details/Index";
import Description from "./components/details/Description";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    Gallery,
    Index,
    Description,
  },

  data: () => ({}),

  mounted() {
    this.getProductDataById(this.$route.params.id);
  },

  computed: {
    ...mapState("products", ["productDataById"]),
  },

  methods: {
    ...mapActions("products", {
      getProductDataById: "getDataById",
    }),
  },
};
</script>
