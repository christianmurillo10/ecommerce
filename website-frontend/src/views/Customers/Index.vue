<template>
  <v-layout wrap>
    <v-container class="content">
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>
          <v-layout wrap>
            <v-flex xs12 sm12 md3 lg3>
              <v-container>
                <Information />
              </v-container>
            </v-flex>
            <v-flex xs12 sm12 md9 lg9>
              <v-container>
                <Tabs />
              </v-container>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </v-layout>
</template>

<script>
import Information from "@/components/modules/Customers/Information";
import Tabs from "@/components/modules/Customers/Tabs/Index";

export default {
  components: {
    Information,
    Tabs,
  },
};
</script>
