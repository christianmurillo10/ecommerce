<template>
  <v-layout wrap>
    <Snackbars />
    <v-flex xs12 sm12 md6 lg6>
      <v-container>
        <v-card outlined color="grey lighten-4">
          <v-card-title>Information</v-card-title>
          <InformationForm />
        </v-card>
      </v-container>
    </v-flex>
    <v-flex xs12 sm12 md6 lg6>
      <v-container>
        <v-card outlined color="blue lighten-5">
          <v-card-title>Change Password</v-card-title>
          <ChangePasswordForm />
        </v-card>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
import Snackbars from "@/components/utilities/Snackbars";
import Mixins from "@/helpers/Mixins.js";
import ChangePasswordForm from "./Forms/ChangePasswordForm";
import InformationForm from "./Forms/InformationForm";

export default {
  mixins: [Mixins],
  components: {
    Snackbars,
    ChangePasswordForm,
    InformationForm,
  },
};
</script>
