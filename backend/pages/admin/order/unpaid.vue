<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Orders',disabled: true, href: '/admin/order'},{text: `${pageInfo.pageName}`,disabled: true, href: '/admin/order/paid'}]"
    />
    <v-card>
      <order-table status="unpaid"></order-table>
    </v-card>
  </v-container>
</template>
<script>
import OrderTable from "@/components/admin/order/OrderTable";
import BreadCrumbs from "@/components/common/BreadCrumbs";
const permission = 'Order'
const stateName = 'orders'
const storeName='admin/order'

export default {
  name: 'UnpaidOrder',
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
  components: {OrderTable,BreadCrumbs},
  data() {
    return {
      pageInfo: {
        pageName: 'Unpaid Orders',
        apiUrl: '/order/',
        permission
      },
    }
  },
}
</script>
