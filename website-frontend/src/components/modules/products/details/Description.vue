<template>
  <v-card flat>
    <v-card-title class="blue--text">Description</v-card-title>
    <v-card-text>
      <v-sheet class="d-flex" color="grey lighten-5">
        <v-container>
          <div v-if="details.description === ''" class="text-xs-center">
            There have been no description for this product yet.
          </div>
          <div
            v-else
            v-html="details.description"
            style="white-space: pre-wrap;"
          ></div>
        </v-container>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    details: Object,
  },
};
</script>
