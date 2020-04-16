<template>
  <v-container fluid grid-list-md>
    <v-flex xs12 sm12 md4 offset-md8 class="pb-4">
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
    </v-flex>
    <v-flex xs12 sm12 md12>
      <v-data-table :headers="headers" :items="variantDetails" :search="search" class="elevation-1">
        <template v-slot:items="props">
          <td class="text-xs-left">{{ props.item.name }}</td>
          <td class="text-xs-left">&#8369; {{ props.item.price_amount }}</td>
          <td class="text-xs-left">{{ props.item.sku }}</td>
          <td class="text-xs-left">{{ props.item.stock_available }}</td>
        </template>
        <template v-slot:no-data>
          <p class="justify-center layout px-0">No data found!</p>
        </template>
        <template v-slot:no-results>
          <p class="justify-center layout px-0">Your search for "{{ search }}" found no results.</p>
        </template>
      </v-data-table>
    </v-flex>
  </v-container>
</template>

<script>
export default {
  props: {
    variantDetails: Array
  },

  data: () => ({
    search: '',
    headers: [
      { text: "Name", value: "name" },
      { text: "Price Amount", value: "" },
      { text: "SKU", value: "sku" },
      { text: "Stock", value: "" }
    ]
  })
};
</script>
