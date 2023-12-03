<template>
<div v-if="isLoading">
  <div id="loading">Your account is verifying
    <span>
      <div class="loading">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </span>
  </div>
</div>
<div v-else>
  <div>Your account verified</div>
</div>

</template>

<script>

export default {
  name:'verificationPage',
  auth: false,
  data(){
    return{
      isLoading: true
    }
  },

  async mounted() {
   await this.verifyEmail();
  },

  methods: {
    async verifyEmail() {
      let url = `/email-verify-check/${this.$route.params.id}/${this.$route.params.token}`

      await this.$axios.get(url)
      .then((response) => {
        if (response.data.message === 'invalid') {
          this.$toaster.error('Invalid verification link or already verified');
          this.$router.push('/');
          this.isLoading = false;
        } else {
          /*this.$axios.setHeader('Authorization', 'Bearer ' + response.data.access_token);
          this.$axios.setToken(response.data.access_token);
          this.$auth.setUserToken(response.data.access_token);
          this.$auth.setUser(response.data.user);
          this.$router.push('/form');*/
          this.openModal()
        }
      }).catch(() => {
            this.$toaster.error('Invalid verification link or already verified');
            this.$router.push('/');
      }).finally(()=>{
            this.isLoading = false;
        })
    },
    openModal(){
      this.$store.commit('user/basic/SET_LOGIN',true)
    },
  }
}
</script>

<style scoped>
.theme--light.v-card {
  background-color: #fff;
}
#loading {
  background-color: #3858b0;
  color: #fff;
  font-size: 32px;
  padding: 20vh;
  text-align: center;
}

 .loading {
   position: absolute;
    top: 42%;
    left: 60%;
	 display: flex;
	 justify-content: center;
}
 .loading div {
	 width: 1rem;
	 height: 1rem;
	 margin: 2rem 0.3rem;
	 background: #fff;
	 border-radius: 50%;
	 animation: 0.9s bounce infinite alternate;
}
 .loading div:nth-child(2) {
	 animation-delay: 0.3s;
}
 .loading div:nth-child(3) {
	 animation-delay: 0.6s;
}
 @keyframes bounce {
	 to {
		 opacity: 0.3;
		 transform: translate3d(0, -1rem, 0);
	}
}
 .donut {
	 width: 2rem;
	 height: 2rem;
	 margin: 2rem;
	 border-radius: 50%;
	 border: 0.3rem solid rgba(151, 159, 208, 0.3);
	 border-top-color: #fff;
	 animation: 1.5s spin infinite linear;
}
 .donut.multi {
	 border-bottom-color: #fff;
}
 @keyframes spin {
	 to {
		 transform: rotate(360deg);
	}
}
 .ripple {
	 width: 2rem;
	 height: 2rem;
	 margin: 2rem;
	 border-radius: 50%;
	 border: 0.3rem solid #fff;
	 transform: translate(50%);
	 animation: 1s ripple ease-out infinite;
}
 @keyframes ripple {
	 from {
		 transform: scale(0);
		 opacity: 1;
	}
	 to {
		 transform: scale(1);
		 opacity: 0;
	}
}
 .multi-ripple {
	 width: 2.6rem;
	 height: 2.6rem;
	 margin: 2rem;
}
 .multi-ripple div {
	 position: absolute;
	 width: 2rem;
	 height: 2rem;
	 border-radius: 50%;
	 border: 0.3rem solid #fff;
	 animation: 1.5s ripple infinite;
}
 .multi-ripple div:nth-child(2) {
	 animation-delay: 0.5s;
}
 .fancy-spinner {
	 display: flex;
	 justify-content: center;
	 align-items: center;
	 width: 5rem;
	 height: 5rem;
}
 .fancy-spinner div {
	 position: absolute;
	 width: 4rem;
	 height: 4rem;
	 border-radius: 50%;
}
 .fancy-spinner div.ring {
	 border-width: 0.5rem;
	 border-style: solid;
	 border-color: transparent;
	 animation: 2s fancy infinite alternate;
}
 .fancy-spinner div.ring:nth-child(1) {
	 border-left-color: #fff;
	 border-right-color: #fff;
}
 .fancy-spinner div.ring:nth-child(2) {
	 border-top-color: #fff;
	 border-bottom-color: #fff;
	 animation-delay: 1s;
}
 .fancy-spinner div.dot {
	 width: 1rem;
	 height: 1rem;
	 background: #fff;
}
 @keyframes fancy {
	 to {
		 transform: rotate(360deg) scale(0.5);
	}
}
</style>
