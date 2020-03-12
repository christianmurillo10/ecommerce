<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="primaryDrawer.model"
    :permanent="primaryDrawer.type === 'permanent'"
    :temporary="primaryDrawer.type === 'temporary'"
    :clipped="primaryDrawer.clipped"
    :floating="primaryDrawer.floating"
    :mini-variant="primaryDrawer.mini"
    absolute
    overflow
    app
    dark
    mobile-break-point="991"
    width="300"
  >
    <v-list>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img :src="logo" />
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>E-Commerce</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list two-line subheader>
        <v-divider></v-divider>

        <v-list-tile v-if="responsive">
          <v-text-field class="blue-input search-input" label="Search..." color="blue" />
        </v-list-tile>
      </v-list>

      <!-- Parent navigation -->
      <v-list class="pt-0" dense v-for="(link, i) in links" :key="i">
        <template v-if="link.submenus">
          <v-list-group :prepend-icon="link.icon">
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title class="margin-left-n10">{{ link.text }}</v-list-tile-title>
              </v-list-tile>
            </template>
            <!-- Child navigation -->
            <v-list class="pt-0" dense v-for="(child, i) in link.childs" :key="i">
              <template v-if="child.submenus">
                <v-list-group class="margin-left-n10" no-action sub-group>
                  <template v-slot:activator>
                    <v-list-tile>
                      <v-list-tile-title>{{ child.text }}</v-list-tile-title>
                    </v-list-tile>
                  </template>
                  <!-- Sub-child navigation -->
                  <v-list class="pt-0" dense v-for="(subChild, i) in child.subChilds" :key="i">
                    <v-list-tile :to="subChild.to">
                      <v-list-tile-content>
                        <v-list-tile-title>{{ subChild.text }}</v-list-tile-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                  <!-- End of Sub-child navigation -->
                </v-list-group>
              </template>
              <template v-else>
                <v-list-tile :to="child.to">
                  <v-list-tile-action></v-list-tile-action>
                  <v-list-tile-content class="margin-left-n10">
                    <v-list-tile-title>{{ child.text }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </v-list>
            <!-- End of Child navigation -->
          </v-list-group>
        </template>
        <template v-else>
          <v-list-tile :to="link.to">
            <v-list-tile-action>
              <v-icon>{{ link.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content class="margin-left-n10">
              <v-list-tile-title>{{ link.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
      <!-- End of Parent navigation -->
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";

export default {
  data: () => ({
    logo: "/img/logo.png",
    links: [
      {
        to: "/",
        icon: "dashboard",
        text: "Dashboard"
      },
      {
        icon: "shopping_basket",
        text: "Products",
        submenus: true,
        childs: [
          {
            to: "/productBannerImages",
            text: "Banners"
          },
          {
            to: "/products",
            text: "Lists"
          }
        ]
      },
      {
        icon: "settings_applications",
        text: "Parameters",
        submenus: true,
        childs: [
          {
            text: "Products",
            submenus: true,
            subChilds: [
              {
                to: "/productBrands",
                text: "Brands"
              },
              {
                to: "/productCategories",
                text: "Categories"
              },
              {
                to: "/productSubCategories",
                text: "Sub-Categories"
              }
            ]
          }
        ]
      },
      {
        icon: "build",
        text: "Settings",
        submenus: true,
        childs: [
          {
            to: "/users",
            text: "Users"
          }
        ]
      }
      // {
      //   icon: "build",
      //   text: "Role Based Access",
      //   submenus: true,
      //   childs: [
      //     {
      //       to: "/roles",
      //       text: "Roles"
      //     }
      //   ]
      // }
    ],
    responsive: true
  }),
  computed: {
    ...mapState("toolbar", ["primaryDrawer"])
  }
};
</script>

<style>
.margin-left-n10 {
  margin-left: -10px !important;
}
</style>