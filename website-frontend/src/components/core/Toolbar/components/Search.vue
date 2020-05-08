<template>
  <v-form ref="form" @submit.prevent="search">
    <v-layout row wrap>
      <v-text-field
        v-model="keyword"
        flat
        outlined
        hide-details
        clearable
        dense
        placeholder="Search"
        class="hidden-sm-and-down"
      />
      <v-btn outlined color="grey" height="40px" type="submit">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </v-layout>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    keyword: ""
  }),
  
  mounted() {
    this.initialLoad();
  },

  watch: {
    "$route.params.keyword": function (val) {
      if (!_.isUndefined(val)) this.keyword = this.$route.params.keyword;
      else this.keyword = "";
    }
  },

  methods: {
    initialLoad() {
      if (!_.isUndefined(this.$route.params.keyword)) this.keyword = this.$route.params.keyword;
      else this.keyword = "";
    },

    search() {
      if (this.$refs.form.validate()) {
        if (!_.isEmpty(this.keyword) && this.$route.params.keyword !== this.keyword) this.$router.push(`/search/${this.keyword}/page/1`);
      }
    },
  }
}
</script>