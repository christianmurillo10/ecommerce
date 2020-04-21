<template>
  <v-card-text>
    <v-carousel cycle height="315" width="850" hide-delimiter-background show-arrows-on-hover>
      <v-carousel-item
      v-for="(frontendSliderImage, i) in frontendSliderImageList"
      :key="i"
      :src="frontendSliderImage.file_path"
      max-height="315"
      max-width="850"
      contain
      class="grey darken-4"
      ></v-carousel-item>
    </v-carousel>
  </v-card-text>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  mounted() {
    this.getFrontendSliderImageData();
  },

  computed: {
    ...mapState("frontendSliderImages", ["frontendSliderImageList"]),
  },

  methods: {
    ...mapActions("frontendSliderImages", {
      getFrontendSliderImageData: "getData"
    }),
  }
}
</script>