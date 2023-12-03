const can = {
  methods: {
    $returnData(response) {
      let data = response

      if (response?.data?.data?.data) data = response?.data?.data?.data
      else if (response?.data?.data) data = response?.data?.data
      else if (response?.data) data = response?.data

      return data
    }
  }
}
