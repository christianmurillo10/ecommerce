<template>
  <v-container class="col-lg-10 offset-lg-1">
    <v-layout row wrap>
      <v-flex xs12 sm12 md12 lg12>
        <v-container>
          <v-card>
            <v-card-text>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm12 md3 lg3>
                    <v-container>
                      <v-layout row wrap>
                        <v-img :src="productDataById.productImages[0].file_path" height="300px" />
                      </v-layout>
                    </v-container>
                  </v-flex>
                  <v-flex xs12 sm12 md9 lg9>
                    <v-container>
                      <v-layout row wrap>
                        <h3>{{ productDataById.name }}</h3>
                      </v-layout>
                    </v-container>
                  </v-flex>
                  <v-flex xs12 sm12 md3 lg3>
                    <v-layout row wrap>
                      <template v-for="(productImages, i) in productDataById.productImages">
                        <v-flex xs12 sm12 md3 lg3 :key="i">
                          <v-container>
                            <v-img :src="productImages.file_path" height="60px" />
                          </v-container>
                        </v-flex>
                      </template>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({}),

  mounted() {
    this.getProductDataById(this.$route.params.id);
  },

  computed: {
    ...mapState("products", ["productDataById"])
  },

  watch: {},

  methods: {
    ...mapActions("products", {
      getProductDataById: "getDataById"
    })
  }
};
</script>
