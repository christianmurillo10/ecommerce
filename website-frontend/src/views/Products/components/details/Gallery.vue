<template>
  <div class="thumb-gallery">
    <!-- swiper1 -->
    <swiper
      class="swiper gallery-top"
      :options="swiperOptionTop"
      ref="swiperTop"
    >
      <swiper-slide
        v-for="(image, i) in images"
        :key="i"
        :class="`slide-${i}`"
        :style="`background-image: url('${image.file_path}');`"
      ></swiper-slide>
      <div class="swiper-button-next" slot="button-next"></div>
      <div class="swiper-button-prev" slot="button-prev"></div>
    </swiper>
    <!-- swiper2 Thumbs -->
    <swiper
      class="swiper gallery-thumbs"
      :options="swiperOptionThumbs"
      ref="swiperThumbs"
    >
      <swiper-slide
        v-for="(image, i) in images"
        :key="i"
        :class="`slide-${i}`"
        :style="`background-image: url('${image.file_path}');`"
      ></swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
export default {
  props: {
    images: Array,
  },

  components: {
    Swiper,
    SwiperSlide,
  },

  data: () => ({
    swiperOptionTop: {
      loop: true,
      loopedSlides: 5, // looped slides should be the same
      spaceBetween: 10,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    },
    swiperOptionThumbs: {
      loop: true,
      loopedSlides: 5, // looped slides should be the same
      spaceBetween: 10,
      centeredSlides: true,
      slidesPerView: "auto",
      touchRatio: 0.2,
      slideToClickedSlide: true,
    },
  }),

  mounted() {
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.$swiper;
      const swiperThumbs = this.$refs.swiperThumbs.$swiper;
      swiperTop.controller.control = swiperThumbs;
      swiperThumbs.controller.control = swiperTop;
    });
  },
};
</script>

<style lang="scss" scoped>
.thumb-gallery {
  height: 300px;
  background-color: transparent;
}

.swiper {
  .swiper-slide {
    background-size: contain;
    background-position: center;
  }

  &.gallery-top {
    height: 80%;
    width: 100%;
  }
  &.gallery-thumbs {
    height: 25%;
    box-sizing: border-box;
    padding: 10px 0 0 0;
  }
  &.gallery-thumbs .swiper-slide {
    width: 25%;
    height: 100%;
    opacity: 0.5;
  }
  &.gallery-thumbs .swiper-slide-active {
    opacity: 1;
  }
}
</style>
