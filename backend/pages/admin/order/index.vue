<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Orders',disabled: true, href: '/admin/order'}]"
    />
    <order-table :status="null"></order-table>
  </v-container>
</template>
<script>
import OrderTable from "@/components/admin/order/OrderTable";
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
const permission = 'Order'
const stateName = 'orders'
const storeName='admin/order'

export default {
  name: 'order',
  head: {
    title: 'Order',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
  },
  meta:{
    action: 'read',
    subject: 'Order'
  },
  components: {BreadCrumbs,OrderTable},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Orders',
        apiUrl: '/order/',
        permission
      },
    }
  },
}
</script>
