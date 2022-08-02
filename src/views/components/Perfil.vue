<template>
	<div>
		<vx-card>
			<div class="vx-row">
				<div class="vx-col w-full md:w-1/2">
					 <!-- Col Header -->
					<div class="flex items-end">
						<feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
						<span class="leading-none font-medium">Información Personal</span>
					</div>
					<div>
						<vs-input class="w-full mt-4" label="Doc. Nacional de Identidad" disabled="true" v-model="dni" v-validate="{regex: '^\\+?([0-9]+)$' }" name="dni" />
          				<span class="text-danger text-sm"  v-show="errors.has('dni')">{{ errors.first('dni') }}</span>

          				<vs-input class="w-full mt-4" label="Apellidos" v-model="apellidos" v-validate="'required'" name="apellidos" data-vv-as="apellidos" />
          				<span class="text-danger text-sm"  v-show="errors.has('apellidos')">{{ errors.first('apellidos') }}</span>
						
						<vs-input class="w-full mt-4" label="Nombres" v-model="nombres" v-validate="'required'" name="nombres" data-vv-as="nombres" />
          				<span class="text-danger text-sm"  v-show="errors.has('nombres')">{{ errors.first('nombres') }}</span>

						<vs-input class="w-full mt-4" label="Email" v-model="email" v-validate="'required|email'" name="email" data-vv-as="email" />
          				<span class="text-danger text-sm"  v-show="errors.has('email')">{{ errors.first('email') }}</span>

						<vs-input class="w-full mt-4" label="Telefono movil" v-model="movil" v-validate="{regex: '^\\+?([0-9]+)$'}" name="movil" data-vv-as="movil" />
          				<span class="text-danger text-sm"  v-show="errors.has('movil')">{{ errors.first('movil') }}</span>

						<vs-input class="w-full mt-4" label="Dirección" v-model="direccion" v-validate="''" name="direccion" data-vv-as="direccion" />
          				<span class="text-danger text-sm"  v-show="errors.has('direccion')">{{ errors.first('direccion') }}</span>
					</div>
				</div>

				<div class="vx-col w-full md:w-1/2">
					 <!-- Col Header -->
					<div class="flex items-end">
						<feather-icon icon="MapPinIcon" class="mr-2" svgClasses="w-5 h-5" />
						<span class="leading-none font-medium">Lugar de Trabajo</span>
					</div>
					<div>
						<vs-input class="w-full mt-4" label="Area de Trabajo" v-model="area" v-validate="''" name="area" data-vv-as="area"/>
          				<span class="text-danger text-sm"  v-show="errors.has('area')">{{ errors.first('area') }}</span>

          				<vs-input class="w-full mt-4" label="Gerencia/Subgerencia/Dirección" v-model="gerencia" v-validate="''" name="gerencia" data-vv-as="gerencia" />
          				<span class="text-danger text-sm"  v-show="errors.has('gerencia')">{{ errors.first('gerencia') }}</span>
						
						<vs-input class="w-full mt-4" label="Abreviatura de Gerencia/Subgerencia/Dirección" v-model="abrev" v-validate="'alpha'" name="abrev" data-vv-as="abrev" />
          				<span class="text-danger text-sm"  v-show="errors.has('abrev')">{{ errors.first('abrev') }}</span>
					</div>
				</div>

			</div>
			

			<!-- Save & Reset Button -->
			<div class="vx-row">
				<div class="vx-col w-full">
					<div class="mt-8 flex flex-wrap items-center justify-end">
						<vs-button class="ml-auto mt-2" @click="saveChanges" :disabled="!validateForm">Actualizar</vs-button>
					</div>
				</div>
			</div>
		</vx-card>
	</div>
</template>

<script>

import axios from 'axios';
import { apiUrl } from '@/constants/config'
export default {
	data() {
		return {
			dni:'',
			apellidos:'',
			nombres: '',
			email:'',
			movil:'',
			direccion:'',
			area:'',
			gerencia:'',
			abrev:''
		}
	},
	computed: {
    	validateForm () {
			return !this.errors.any() && this.dni !== '' && this.apellidos !== '' && this.nombres !== '' && this.movil !== ''
		}
	},
	created(){
		this.getUsuarioPerfil();
	},
	methods: {
		getUsuarioPerfil(){
			this.$vs.loading();
			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/usuario/mostrar`,
				method: 'GET' 
			}).then(response =>{
				if(response.data.success){
					let data = response.data.data[0];

					this.dni = data.numeroDocumento,
					this.apellidos= data.apellidos;
					this.nombres= data.nombres;
					this.email= data.email;
					this.movil= data.telefono;
					this.direccion= data.direccion;
					this.area= data.area;
					this.gerencia= data.oficina;
					this.abrev= data.oficinaAbreviatura;				
				}
				this.$vs.loading.close();
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
		saveChanges(){
			this.$vs.loading();
			const paramsData = {
				apellidos: this.apellidos.toUpperCase(),
				nombres: this.nombres.toUpperCase(),
				numeroDocumento: this.dni,
				area: this.area.toUpperCase(),
				oficinaAbreviatura: this.abrev.toUpperCase(),
				email: this.email,
				telefono: this.movil,
				direccion: this.direccion.toUpperCase(),
				oficina: this.gerencia.toUpperCase()
			};

			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/usuario/actualizar`,
				data: paramsData,
				method: 'PUT'
			}).then(response =>{
				if(response.data.success){
					this.$vs.notify({
						title: 'Info!!!',
						text: response.data.msg,
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'success'
					});
				}
				this.$vs.loading.close();
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

	}
}
</script>
