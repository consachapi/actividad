<template>
    <vx-card>
        <div class="vx-row">
				<div class="vx-col w-full md:w-1/2">
					 <!-- Col Header -->
					<div class="flex items-end">
						<feather-icon icon="UserIcon" class="mr-2" svgClasses="w-5 h-5" />
						<span class="leading-none font-medium">Información Personal</span>
					</div>
					<div>
						<vs-input class="w-full mt-4" label="Doc. Nacional de Identidad" :disabled="enabledDni" v-model="dni" v-validate="{regex: '^\\+?([0-9]+)$' }" name="dni" />
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
						<vs-button @click="guardar" :disabled="!validateForm" class="ml-auto mt-2">Guardar</vs-button>
                        <vs-button @click="limpiar" class="ml-4 mt-2" type="border" color="primary">Limpiar</vs-button>
                        <vs-button @click="regresar" class="ml-4 mt-2" type="border" color="primary">Regresar</vs-button>
					</div>
				</div>
			</div>
    </vx-card>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '@/constants/config'
export default {
    data(){
        return {
			parametro: null,
            dni:'',
			apellidos:'',
			nombres: '',
			email:'',
			movil:'',
			direccion:'',
			area:'',
			gerencia:'',
			abrev:'',
            enabledDni: false
        }
    },
    created(){
        this.parametro = this.$route.params.id;
        if(this.parametro === 'nuevo'){
            this.enabledDni = false;
        } else {
            this.enabledDni = true;
            this.getPersonal(this.parametro);
        }
    },
    computed: {
    	validateForm () {
			return !this.errors.any() && this.dni !== '' && this.apellidos !== '' && this.nombres !== '' && this.email !== '' && this.movil !== ''
		}
	},
    methods:{
        getPersonal(dni){
            this.$vs.loading();
			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/usuario/personal/ver/${ dni }`,
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
				this.showNotify(erro.response.status);
			});
        },

        guardar(){
            if(this.parametro === 'nuevo'){
                this.nuevoPersonal();
            } else {
                this.editarPersonal();
            }
        },

        nuevoPersonal(){
            this.$vs.loading();
			const paramsData = {
                numeroDocumento: this.dni,
				apellidos: this.apellidos.toUpperCase(),
				nombres: this.nombres.toUpperCase(),
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
				url: `${apiUrl}/usuario/personal/crear`,
				data: paramsData,
				method: 'POST'
			}).then(response =>{
				if(response.data.success){
					this.$vs.notify({
						title: 'Info!!!',
						text: response.data.msg,
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'success'
					});
                    this.regresar();
				}
				this.$vs.loading.close();
			}).catch(erro => {
				this.$vs.loading.close();
				this.showNotify(erro.response.status);
			});
        },

        editarPersonal(){
            this.$vs.loading();
			const paramsData = {
                numeroDocumento: this.dni,
				apellidos: this.apellidos.toUpperCase(),
				nombres: this.nombres.toUpperCase(),
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
				url: `${apiUrl}/usuario/personal/editar/${ this.dni }`,
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
                    this.regresar();
				}
				this.$vs.loading.close();
			}).catch(erro => {
				this.$vs.loading.close();
				this.showNotify(erro.response.status);
			});
        },

        showNotify(status){
            if(status === 400){
				this.$vs.notify({
					title: 'Error',
					text: 'Ocurrio un error inesperado. Intente mas tarde.',
					iconPack: 'feather',
					icon: 'icon-alert-circle',
					color: 'danger'
				});
			}

			if(status === 401){
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
        },

        regresar(){
            this.$router.push('/personal').catch(() => {})
        },

        limpiar(){
            if(this.parametro === 'nuevo'){
               this.dni = ''; 
            }
            this.apellidos = '';
            this.nombres = '';
            this.email = '';
            this.movil = '';
            this.direccion = '';
            this.area = '';
            this.gerencia = '';
            this.abrev = '';
        }
    }
}
</script>