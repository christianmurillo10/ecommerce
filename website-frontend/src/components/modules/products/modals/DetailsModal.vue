<template>
  <v-dialog v-model="dialog" scrollable max-width="800">
    <v-card>
      <v-card-title>
        <v-icon class="blue--text">mdi-cart</v-icon>
        <span class="title blue--text">
          Product Details
        </span>
        <v-spacer></v-spacer>
        <v-icon @click="dialog = false">mdi-close</v-icon>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
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
                    <Index
                      :is-modal="true"
                      :details="productDataById"
                      @setProductDetailsDialog="setDialog"
                    />
                  </v-container>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Gallery from "../details/Gallery";
import Index from "../details/Index";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Gallery,
    Index,
  },

  data: () => ({
    dialog: false,
  }),

  computed: {
    ...mapState("products", ["productDataById"]),
  },

  methods: {
    ...mapActions("products", {
      getProductDataByIdWithImageType: "getDataByIdWithImageType",
    }),

    setDialog(value, id) {
      this.dialog = value;
      if (value) {
        this.getProductDataByIdWithImageType({ id: id, image_type: 2 });
      }
    },
  },
};
</script>
