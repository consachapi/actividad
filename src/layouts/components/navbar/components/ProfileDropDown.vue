<template>
  <div class="the-navbar__user-meta flex items-center" v-if="activeUserInfo.displayName">

    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ nombresUsuario }}</p>
      <small>{{ oficina }}</small>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">

      <div class="con-img ml-3">
        <img v-if="activeUserInfo.photoURL" key="onlineImg" :src="activeUserInfo.photoURL" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 9rem">
          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="perfil">
            <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Perfil</span>
          </li>

          <vs-divider class="m-1" />

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout">
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Salir</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import axios from '@/axios.js';
import { apiUrl } from '@/constants/config';
export default {
  data() {
    return {
      oficina: 'Sin oficina',
      nombresUsuario: 'Anómino',
      valMultipe:{
        actual:'',
        nuevo:'',
        repite:''
      },
    }
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    },
    validName(){
      return (this.valMultipe.actual.length > 0 && this.valMultipe.nuevo.length > 0 && this.valMultipe.repite.length > 0)
    }
  },
  created(){
		this.loadUsuario();
	},
  methods: {
    loadUsuario(){
      this.$http.getResumenUsuario()
      .then(response => {
        if(response.data.success){
          this.nombresUsuario = response.data.data[0].nombres;
					this.oficina = response.data.data[0].oficina;
				}
      })
      .catch(error => {
        this.$vs.notify({
						title: 'Error',
						text: 'Ocurrio un error inesperado al extraer usuario.',
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
				});
        this.$store.dispatch("logout").then(() => {
          this.$router.push('/pages/login').catch(() => {})
        });
      });
    },

    perfil(){
      this.$router.push('/perfil').catch(() => {})
    },
  
    logout() {
      this.$store.dispatch("logout").then(() => {
				this.$router.push('/pages/login').catch(() => {})
			});
    },
  }
}
</script>
