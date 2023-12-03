export const common = {
  methods: {
    addOrUpdateState(response, stateName, storeName) {
      if (this.editMode) {
        const payload = {data: response?.data?.data, index: this.editIndex, stateName}
        this.$store.commit(storeName + '/UPDATE_ITEM', payload)
      } else {
        const payload = {data: response?.data?.data, stateName}
        this.$store.commit(storeName + '/INSERT_NEW_ITEMS', payload)
      }
    },
    async deleteItem(item, index, storeName) {
      this.$swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        text: `Do you want to delete this ${this.pageInfo.pageName}?`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loader.isDeleting = true
          await this.$axios.delete(`${this.pageInfo.apiUrl + item.id}`).then((response) => {
            const payload = {stateName: this.state.name, index: index}
            this.$store.commit(storeName + '/DELETE_ITEM', payload)
            let message = `${this.pageInfo.pageName} has been deleted!`;
            if (response.data){
              if (response.data.message) message = response.data.message;
            }
            this.$swal.fire('Deleted!', message, 'success')
          }).catch((error) => {
            let message = 'Something went wrong!!';
            if (error.response.data){
              if (error.response.data.message) message = error.response.data.message;
            }
            this.$toaster.error(message)
          }).finally(() => this.loader.isDeleting = 0)
        }
      })
    },
    async deleteItemBasic(item) {
      this.$swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        text: `Do you want to delete this ${this.pageInfo.pageName}?`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then(async (result) => {
        if (result.isConfirmed) {
         // this.loader.isDeleting = true
          await this.$axios.delete(`${this.pageInfo.apiUrl + item.id}`).then((response) => {
            let message = `${this.pageInfo.pageName} has been deleted!`;
            if (response.data){
              if (response.data.message) message = response.data.message;
            }
            this.$toaster.success(message)
          }).catch((error) => {
            let message = 'Something went wrong!!';
            if (error.response.data){
              if (error.response.data.message) message = error.response.data.message;
            }
            this.$toaster.error(message)
          }).finally(() => this.loader.isDeleting = 0)
        }
      })
    },

    toggleStatusChange(index, value, event, id, stateName, storeName, name='is_active') {
      this.$axios.put(`${this.pageInfo.apiUrl}toggle/${id}`)
        .then(response => {
          if (response.data.status === 'success') {
            const payload = {index, stateName, name}
            this.$store.commit(storeName + '/STATUS_CHANGE', payload)
            this.$toaster.success(response.data.message)
          } else {
            this.$toaster.error(response.data.message)
          }
        })
        .catch(() => {
          this.$toaster.error('Something went wrong!!')
        })
    },

    statusChange(index, value, id, stateName, storeName, name='status') {
      this.$axios.put(`${this.pageInfo.apiUrl}status/change/${id}`)
        .then(response => {
          if (response.data.status === 'success') {
            const payload = {index, stateName, name, value}
            this.$store.commit(storeName + '/ANY_STATUS_CHANGE', payload)
            this.$toaster.success(response.data.message)
          } else {
            this.$toaster.error(response.data.message)
          }
        })
        .catch(() => {
          this.$toaster.error('Something went wrong!!')
        })
    },
    async customStatusChange(index, value, id, stateName, storeName, name='status') {
      this.$swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        text: `Do you want to change status`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loader.isDeleting = true
          await this.$axios.put(`${this.pageInfo.apiUrl}status/change/${id}/${value}`)
            .then(response => {
              if (response.data.status === 'success') {
                const payload = {index, stateName, name, value}
                this.$store.commit(storeName + '/ANY_STATUS_CHANGE', payload)
                this.$toaster.success(response.data.message)
              } else {
                this.$toaster.error(response.data.message)
              }
            })
            .catch(() => {
              this.$toaster.error('Something went wrong!!')
            }).finally(() => this.loader.isDeleting = 0)
        }
      })
    },

    applyDrag (arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult
      if (removedIndex === null && addedIndex === null) return arr

      const result = [...arr]
      let itemToAdd = payload

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0]
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd)
      }

      return result
    }

  }
}
