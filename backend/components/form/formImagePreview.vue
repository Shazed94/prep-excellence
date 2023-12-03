<template>
  <div>
    <template v-if="imageProps && imagePreview">
      <div class="d-flex flex-wrap">
        <div v-for="(image, im) in imagePreview" :key="im" class="formImageContainer">
          <img
            :src="image.src"
            alt="image"
            height="46px"
            class="rounded"
            style="margin: 2px 6px 2px 0; max-width: 100% !important; width: 100%"
          >
          <v-icon
            class="imageCloseButton"
            color="error"
            @click.stop.prevent="removeImageFromCollection('logo', im,false)"
          >
            mdi-close-circle
          </v-icon>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="existingImages && Array.isArray(existingImages)" class="d-flex flex-wrap">
        <div v-for="(image, im) in existingImages" :key="im" class="formImageContainer">
          <img
            :src="image"
            alt="image"
            height="46px"
            class="rounded"
            style="margin: 2px 6px 2px 0; max-width: 100% !important; width: 100%"
          >
        </div>
      </div>
      <div v-else class="d-flex flex-wrap">
        <div class="formImageContainer">
          <img
            v-if="existingImages"
            :src="existingImages"
            alt="image"
            height="46px"
            width="auto"
            class="rounded"
            style="margin: 2px 6px 2px 0; max-width: 100% !important; width: 100%"
          >
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: ['imageProps', 'existingImages'],
  data() {
    return {
      imagePreview: null
    }
  },
  watch: {
    imageProps(newVal) {
      this.onFilePicked(newVal)
    }
  },
  methods: {
    onFilePicked(files) {
      this.imagePreview = []
      if (files) {
        if (Array.isArray(files) && files.length) {
          files.forEach((element) => this.imagePreview.push({'src': URL.createObjectURL(files) || ''}))

          return
        }
        if (files) this.imagePreview.push({'src': URL.createObjectURL(files) || ''})
      }
    },
    removeImageFromCollection(imageName, imageKey, isMultiple = false) {
      if (isMultiple) this.$emit('removeImage', imageKey)
      else this.$emit('removeImage', null)
      this.imagePreview.splice(imageKey, 1)
    },
  }
}
</script>


<style scoped>
.formImageContainer {
  position: relative;
  margin: 0 6px;
}

.imageCloseButton {
  position: absolute;
  top: -2px;
  right: -4px;
  background-color: #09153A;
  border-radius: 50%;
}

.imageBox {
  border: 3px solid transparent;
  transition: all 400ms ease-in-out;
  cursor: pointer;
}

.selectedImage {
  border: 3px solid dodgerblue;
  border-radius: 6px;
  position: relative;
  transition: all 400ms ease-in-out;
}

.selectedImage::after {
  transition: all 400ms ease-in-out;
  content: '';
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, .4);
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 6px;
}
</style>
