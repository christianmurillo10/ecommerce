<template>
  <v-container fluid grid-list-md>
    <v-data-iterator
      :items="variantDetails"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      content-class="layout row wrap"
    >
      <template v-slot:item="props">
        <v-flex xs12 sm12 md3 lg3>
          <v-card>
            <v-card-title>
              <h4>{{ props.item.title }}</h4>
            </v-card-title>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-tile
                v-for="(value, key) in JSON.parse(props.item.values).map(
                  (element) => element.name
                )"
                :key="key"
              >
                <v-list-tile-content>Value:</v-list-tile-content>
                <v-list-tile-content class="align-end">
                  {{ value }}
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
export default {
  props: {
    variantDetails: Array,
  },

  data: () => ({
    rowsPerPageItems: [4, 8, 12],
    pagination: {
      rowsPerPage: 4,
    },
  }),
};
</script>
