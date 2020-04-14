<template>
  <v-layout row wrap>
    <v-flex xs12 sm12 md12 lg12>
      <v-hover>
        <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 1}`">
          <v-card-title primary-title>
            <h4 class="title">Featured Products</h4>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="feauredProductList"
              class="elevation-1"
            >
              <template v-slot:items="props">
                <td class="text-xs-left pt-1">
                  <img
                    :src="props.item.image"
                    height="80"
                    width="120"
                  />
                </td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.price_amount }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      headers: [
      { text: "Image", value: "", sortable: false },
        { text: "Name", value: "name" },
        { text: "Price Amount", value: "price_amount" },
      ],
      feauredProductList: [
        {
          image: require("../../../assets/images/no-image.png"),
          name: "Product 1",
          price_amount: "100.00"
        },
        {
          image: require("../../../assets/images/no-image.png"),
          name: "Product 2",
          price_amount: "100.00"
        },
        {
          image: require("../../../assets/images/no-image.png"),
          name: "Product 3",
          price_amount: "100.00"
        },
        {
          image: require("../../../assets/images/no-image.png"),
          name: "Product 4",
          price_amount: "100.00"
        },
        {
          image: require("../../../assets/images/no-image.png"),
          name: "Product 5",
          price_amount: "100.00"
        }
      ]
    };
  }
};
</script>
