<template>
  <v-form ref="form" @submit.prevent="search">
    <v-layout row wrap>
      <v-text-field
        class="toolbar-search-input"
        v-model="keyword"
        rounded
        outlined
        dense
        hide-details
        clearable
        placeholder="Search..."
        prepend-inner-icon="mdi-magnify"
        color="blue"
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
    "$route.query.keyword": function(val) {
      if (!_.isUndefined(val)) this.keyword = val;
      else this.keyword = "";
    },
  },

  methods: {
    initialLoad() {
      if (!_.isUndefined(this.$route.query.keyword)) this.keyword = this.$route.query.keyword;
      else this.keyword = "";
    },

    search() {
      if (this.$refs.form.validate()) {
        if (!_.isEmpty(this.keyword) && this.$route.query.keyword !== this.keyword)
          this.$router.push({ path: `/search`, query: { keyword: this.keyword } });
      }
    },
  },
};
</script>
