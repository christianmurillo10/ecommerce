<template>
  <v-form ref="form" @submit.prevent="search">
    <v-layout row wrap>
      <v-text-field
        class="toolbar-search-input"
        v-model="keyword"
        filled
        rounded
        dense
        hide-details
        clearable
        placeholder="Search..."
        prepend-inner-icon="mdi-magnify"
      />
    </v-layout>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    keyword: "",
  }),

  mounted() {
    this.initialLoad();
  },

  watch: {
    "$route.params.keyword": function(val) {
      if (!_.isUndefined(val)) this.keyword = this.$route.params.keyword;
      else this.keyword = "";
    },
  },

  methods: {
    initialLoad() {
      if (!_.isUndefined(this.$route.params.keyword))
        this.keyword = this.$route.params.keyword;
      else this.keyword = "";
    },

    search() {
      if (this.$refs.form.validate()) {
        if (
          !_.isEmpty(this.keyword) &&
          this.$route.params.keyword !== this.keyword
        )
          this.$router.push(`/search/${this.keyword}/page/1`);
      }
    },
  },
};
</script>
