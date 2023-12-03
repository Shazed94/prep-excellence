<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        color="red"
        small
        :loading="isLoading"
        v-bind="attrs"
        @click="download"
        v-on="on"
      >
        <v-icon>mdi-file</v-icon>
      </v-btn>
    </template>
    <span>Export Pdf</span>
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

        link.setAttribute('download', filename + '.pdf')
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
