<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-container class="col-lg-10 offset-lg-1">
        <v-layout row wrap>
          <v-flex xs12 sm12 md12 lg12>
            <v-card>
              <v-card-text>
                <v-container>
                  <v-layout row wrap>
                    <v-flex xs12 sm12 md5 lg5>
                      <Gallery :images="productDataById.productImages" />
                    </v-flex>
                    <v-flex xs12 sm12 md7 lg7>
                      <Index :details="productDataById" />
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md9 lg9>
            <Description :details="productDataById" />
          </v-flex>
          <v-flex xs12 sm12 md3 lg3>
            <v-card>
              <v-card-title>Sponsored Products</v-card-title>
            </v-card>
          </v-flex>
          <v-flex xs12 sm12 md9 lg9>
            <v-card>
              <v-card-title>Ratings & Reviews</v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-layout>
  </v-container>
</template>

<script>
import Gallery from './components/details/Gallery';
import Index from './components/details/Index';
import Description from './components/details/Description';
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  components: {
    Gallery,
    Index,
    Description
  },

  data: () => ({ }),

  mounted() { 
  },

  created() {
    this.getProductDataById(this.$route.params.id);
  },

  computed: {
    ...mapState("products", ["productDataById"])
  },

  methods: {
    ...mapActions("products", {
      getProductDataById: "getDataById"
    })
  }
};
</script>