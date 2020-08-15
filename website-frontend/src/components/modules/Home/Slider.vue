<template>
  <v-carousel
    cycle
    height="400"
    hide-delimiter-background
    delimiter-icon="mdi-minus"
    show-arrows-on-hover
  >
    <v-carousel-item
      v-for="(frontendSliderImage, i) in frontendSliderImageList"
      :key="i"
      :src="frontendSliderImage.file_path"
      max-height="400"
      max-width="1240"
      class="grey darken-4"
    ></v-carousel-item>
  </v-carousel>
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
      getFrontendSliderImageData: "getData",
    }),
  },
};
</script>
