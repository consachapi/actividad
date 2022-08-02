<template>
    <vx-card>
        <div class="flex flex-wrap items-center">
            <vs-avatar :src="activeUserInfo.photoURL" size="70px" class="mr-4 mb-4" />
            <div class="vx-row">
                <div class="vx-col w-full md:w-1/2">
                    <vs-input 
					class="w-full mb-base mr-4 sm:mb-0 mb-2" 
					placeholder="Número de doc." 
					v-model="username" 
					v-on:keyup.enter="buscar" 
					v-validate="'required|min:4|max:8|numeric'" 
					name="Nro documento" 
					icon="icon-search" 
					icon-pack="feather" >
					</vs-input>
                    <span class="text-danger text-sm">{{ errors.first('Nro documento') }}</span>
                </div>
                <div class="vx-col w-full md:w-1/2">
                    <vs-button @click="buscar" class="mr-4 sm:mb-0 mb-2">Buscar</vs-button>
                </div>
            </div>
        </div>

        <vs-input class="w-full mt-4" label="Nombres" placeholder="Nombres" v-model="firstname" v-validate="'required'" name="Nombres"></vs-input>
        <span class="text-danger text-sm">{{ errors.first('Nombres') }}</span>
        <vs-input class="w-full mt-4" label="Apellidos" placeholder="Apellidos" v-model="lastname" v-validate="'required'" name="Apellidos"></vs-input>
        <span class="text-danger text-sm">{{ errors.first('Apellidos') }}</span>
        <vs-input class="w-full mt-4" label="Email" placeholder="Email" v-model="email" v-validate="'required|email'" name="Email"></vs-input>
        <span class="text-danger text-sm">{{ errors.first('Email') }}</span>
        <vs-input class="w-full mt-4" label="Contraseña" type="password" placeholder="Contraseña" v-model="password" v-validate="'required|min:4|max:20'" name="Password"></vs-input>
        <span class="text-danger text-sm">{{ errors.first('Password') }}</span>

        <div class="flex flex-wrap items-center justify-end">
            <vs-button @click="guardar" :disabled="!validateForm" class="ml-auto mt-2">Guardar</vs-button>
            <vs-button @click="resetAll" class="ml-4 mt-2" type="border" color="warning">Reset</vs-button>
        </div>
    </vx-card>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '@/constants/config'
export default {
    data(){
        return {
            username: '',
            firstname: '',
            lastname: '',
            email: '',
            password: ''
        }
    },
    computed: {
        activeUserInfo () {
            return this.$store.state.AppActiveUser
        },
        validateForm () {
            return !this.errors.any() && this.username !== '' && this.firstname !== '' && this.lastname !== '' && this.email !== '' && this.password !== '';
        }
    },
    methods: {
        buscar(){
            if(this.username.length === 0){
                return;
            }
            this.reset();
            this.$vs.loading();
			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/usuario/personal/ver/${ this.username }`,
				method: 'GET' 
			}).then(response =>{
                this.$vs.loading.close();
				if(response.data.success){
					let data = response.data.data[0];
					this.lastname= data.apellidos;
					this.firstname= data.nombres;
					this.email= data.email;				
				} else {
                    this.$vs.notify({
						title: 'Error',
						text: response.data.msg,
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					});
                }
			}).catch(erro =>{
				this.$vs.loading.close();
				if(erro.response.status === 400){
					this.$vs.notify({
						title: 'Error',
						text: 'Ocurrio un error inesperado. Intente mas tarde.',
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					});
				}

				if(erro.response.status === 401){
					this.$vs.notify({
						title: 'Info!!!',
						text: 'La sesion ha expirado.',
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					});
					this.$store.dispatch("logout").then(() => {
						this.$router.push('/pages/login').catch(() => {})
					});
				}
			});
        },
        guardar(){
            this.$vs.loading();
			const paramsData = {
				username: this.username,
				firstname: this.firstname.toUpperCase(),
				lastname: this.lastname.toUpperCase(),
				email: this.email,
				password: this.password.trim(),
			};

			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/usuario/crear`,
				data: paramsData,
				method: 'POST'
			}).then(response =>{
                this.$vs.loading.close();
				if(response.data.success){
					this.$vs.notify({
						title: 'Info!!!',
						text: response.data.msg,
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'success'
					});
                    this.resetAll();
				} else {
                   this.$vs.notify({
						title: 'Info!!!',
						text: response.data.msg,
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					}); 
                }
			}).catch(erro =>{
				this.$vs.loading.close();
				if(erro.response.status === 400){
					this.$vs.notify({
						title: 'Error',
						text: 'Ocurrio un error inesperado. Intente mas tarde.',
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					});
				}

				if(erro.response.status === 401){
					this.$vs.notify({
						title: 'Info!!!',
						text: 'La sesion ha expirado.',
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					});
					this.$store.dispatch("logout").then(() => {
						this.$router.push('/pages/login').catch(() => {})
					});
				}
			});
        },
        reset(){
            this.firstname = '';
            this.lastname = '';
            this.email = '';
            this.password = '';
        },
        resetAll(){
            this.username = '';
            this.firstname = '';
            this.lastname = '';
            this.email = '';
            this.password = '';
        }
    }
}
</script>