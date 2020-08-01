<template>
  <v-card outlined>
    <v-tabs v-model="tab" background-color="white" grow>
      <v-tabs-slider></v-tabs-slider>
      <v-tab v-for="(item, i) in items" :key="i" :href="'#' + item.url">
        <v-icon>{{ item.icon }}</v-icon>
        <span class="caption">{{ item.name }}</span>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="tab-overview">
        <Overview />
      </v-tab-item>
      <v-tab-item value="tab-order-list">
        <OrderList />
      </v-tab-item>
      <v-tab-item value="tab-history">
        <History />
      </v-tab-item>
      <v-tab-item value="tab-account-settings">
        <AccountSettings />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import Overview from "./components/Overview";
import OrderList from "./components/OrderList";
import History from "./components/History";
import AccountSettings from "./components/AccountSettings";

export default {
  components: {
    Overview,
    OrderList,
    History,
    AccountSettings,
  },

  data: () => ({
    items: [
      { name: "Overview", icon: "mdi-home", url: "tab-overview" },
      { name: "Order List", icon: "mdi-basket", url: "tab-order-list" },
      {
        name: "History",
        icon: "mdi-file-document-outline",
        url: "tab-history",
      },
      {
        name: "Account Settings",
        icon: "mdi-account",
        url: "tab-account-settings",
      },
    ],
    tab: null,
  }),
};
</script>
