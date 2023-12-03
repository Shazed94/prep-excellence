<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        small
        :loading="isLoading"
        color="light-green"
        v-bind="attrs"
        @click="download"
        v-on="on"
      >
        <v-icon>mdi-file-table</v-icon>
      </v-btn>
    </template>
    <span>Export CSV</span>
  </v-tooltip>
</template>
<script>
export default {
  props: ['url', 'file_name'],
  data() {
    return {
      isLoading: false,
    }
  },
  methods: {
    download() {
      this.isLoading = true
      this.$axios.get(this.url, {
        headers:
          {
            'Content-Disposition': 'attachment; filename=template.xlsx',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          },
        responseType: 'arraybuffer'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')

        link.href = url
        const filename = this.file_name ?? 'exported-data'

        link.setAttribute('download', filename + '.csv')
        document.body.appendChild(link)
        link.click()
        this.$toaster.success('Downloaded successfully!!')
      }).catch((error) => {
        console.log(error)
        this.$toaster.success('Something went wrong!!')
      }).finally(() => this.isLoading = false)
    }
  }
}
</script>
