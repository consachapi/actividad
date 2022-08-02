<template>
    <div class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center" id="page-login">
        <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
            <vx-card>
                <div slot="no-body" class="full-page-bg-color">

                    <div class="vx-row no-gutter justify-center items-center">

                        <div class="vx-col hidden lg:block lg:w-1/2">
                            <img src="@/assets/images/pages/app.png" width="450" alt="login" class="mx-auto">
                            <div class="flex flex-wrap items-center justify-end mr-base">
                              <span class="font-medium text-primary text-sm float-center">Versión {{ appVersion }}</span>
                            </div>
                        </div>

                        <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
                            <div class="p-8 login-tabs-container mb-base">

                                <div class="vx-card__title mb-4 mt-base">
                                  <div class="mt-2 flex flex-wrap items-center justify-center">
                                    <h4 class="font-bold text-primary float-center">MiPROYECTO</h4>
                                  </div>
                                  <h5 class="mb-4 font-medium">{{ appName }}</h5>
                                  <p>Bienvenido, inicie sesión con su cuenta.</p>
                                  <router-link tag="div" class="vx-logo cursor-pointer flex items-center" to="/pages/politicas/privacidad">
                                      <span class="text-success font-medium text-sm">Políticas de Privacidad.</span>
                                  </router-link>
                                </div>

                                <div>
                                    <vs-input
                                        name="usuario"
                                        icon-no-border
                                        icon="icon icon-user"
                                        icon-pack="feather"
                                        label-placeholder="Usuario"
                                        v-model="usuario"
                                        class="w-full"/>

                                    <vs-input
                                        data-vv-validate-on="blur"
                                        v-validate="'required|min:4|max:20'"
                                        type="password"
                                        name="password"
                                        icon-no-border
                                        icon="icon icon-lock"
                                        icon-pack="feather"
                                        label-placeholder="Contraseña"
                                        v-model="password"
                                        v-on:keyup.enter="initSession"
                                        class="w-full mt-6" />
                                    <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                                    <div class="flex flex-wrap justify-between my-5">
                                        <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Recordarme</vs-checkbox>
                                    </div>

                                    <vs-button class="float-right mb-6" :disabled="!validateForm" @click="initSession">Ingresar</vs-button>
                                    
                                    <vs-divider icon-pack="feather" icon="icon-star" position="center" color="danger"></vs-divider>

                                    <div class="social-login-buttons flex flex-wrap items-center mt-4">
                                        <p>
                                            <span>&copy;</span>
                                            <span>{{ new Date().getFullYear() }}, </span>
                                            <a :href="appEntidadUrl" target="_blank" rel="nofollow">{{ appAuthor }}</a>
                                        </p>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</template>

<script>
import { clientId, grantType, appName, appVersion, appAuthor, appEntidadUrl } from '@/constants/config';
export default{
  data() {
    return {
      appName: appName,
      appVersion: appVersion,
      appAuthor: appAuthor,
      appEntidadUrl: appEntidadUrl,

      usuario: "",
      password: "",
      checkbox_remember_me: false
    }
  },
  computed: {
    validateForm () {
      return !this.errors.any() && this.usuario !== '' && this.password !== ''
    }
  },
  methods: {
    initSession(){
      this.$vs.loading();
      const obj = {
        username: this.usuario,
        password: this.password,
        grant_type: grantType,
        client_id: clientId
      };

      const data = Object.keys(obj)
      .map((key, index) => `${key}=${encodeURIComponent(obj[key])}`)
      .join('&');

      this.$store.dispatch("login", data)
      .then(response => {
        this.$vs.loading.close();
        this.$router.push({ path: '/'});
			})
			.catch(err => {
        this.$vs.loading.close();
        if(err.status === 401){
          this.$vs.notify({
            title: 'Error',
            text: 'El usuario o contraseña es incorrecto.',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          });
        } else {
  
          this.$vs.notify({
            title: 'Error',
            text: 'Ocurrio un error inseperado. Intente mas tarde.',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger'
          });
        }
			});
    }
  }
}
</script>

<style lang="scss">
#page-login {
  .social-login-buttons {
    .bg-facebook { background-color: #1551b1 }
    .bg-twitter { background-color: #00aaff }
    .bg-google { background-color: #4285F4 }
    .bg-github { background-color: #333 }
  }
}
</style>
