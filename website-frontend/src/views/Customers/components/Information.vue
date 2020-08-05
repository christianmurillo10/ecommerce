<template>
  <v-card outlined>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12 class="text-center">
          <v-avatar size="120">
            <v-img :src="customerInfo.file_path"></v-img>
          </v-avatar>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12>
          <v-divider></v-divider>
        </v-flex>
        <v-flex xs12 sm12 md12 lg12>
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <tr>
                  <td><v-icon>mdi-account</v-icon></td>
                  <td>
                    <span class="body-2">{{
                      setFullnameLastnameFirst(
                        customerInfo.firstname,
                        customerInfo.middlename,
                        customerInfo.lastname
                      )
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td><v-icon>mdi-gender-male-female</v-icon></td>
                  <td>
                    <span class="body-2">{{
                      getGenderTypes(customerInfo.gender_type)
                    }}</span>
                  </td>
                </tr>
                <tr>
                  <td><v-icon>mdi-email</v-icon></td>
                  <td>
                    <span class="body-2">{{ customerInfo.email }}</span>
                  </td>
                </tr>
                <tr>
                  <td><v-icon>mdi-contacts</v-icon></td>
                  <td>
                    <span class="body-2">{{ customerInfo.contact_no }}</span>
                  </td>
                </tr>
                <tr>
                  <td><v-icon>mdi-bank</v-icon></td>
                  <td>
                    <span class="body-2">{{
                      customerInfo.primary_address
                    }}</span>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import Mixins from "@/helpers/Mixins.js";
import { mapState, mapActions } from "vuex";

export default {
  mixins: [Mixins],

  data: () => ({
    image: require("@/assets/images/no-image.png"),
  }),

  computed: {
    ...mapState("customerAuthentication", ["customerInfo"]),
  },
};
</script>

<style lang="scss" scoped>
.v-data-table__wrapper {
  overflow: hidden;
}

.v-data-table td,
.v-data-table th {
  padding: 0 10px 0 0;
  height: 35px;
}
</style>
