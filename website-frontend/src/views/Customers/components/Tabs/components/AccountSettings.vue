<template>
  <v-container fluid>
    <v-layout wrap row>
      <Snackbars />
      <v-flex xs12 sm12 md6 lg6>
        <v-card color="grey lighten-4">
          <v-card-title>Information</v-card-title>
          <InformationForm />
        </v-card>
      </v-flex>
      <v-flex xs12 sm12 md6 lg6>
        <v-card color="blue lighten-5">
          <v-card-title>Change Password</v-card-title>
          <ChangePasswordForm />
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
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
    InformationForm
  }
};
</script>
