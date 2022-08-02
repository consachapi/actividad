<template>
    <vx-card :title="titulo" :subtitle="subtitulo">
        <vs-table stripe :data="listaEncuestas">
            <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-start">
				<vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
					<div class="p-3 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
						<span class="mr-2">{{ currentx * sizePage - (sizePage - 1) }} - {{ totalElements - currentx * sizePage > 0 ? currentx * sizePage : totalElements }} de {{ totalElements }}</span>
						<feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
					</div>
					<vs-dropdown-menu>
						<vs-dropdown-item @click="sizePage=5">
							<span>5</span>
						</vs-dropdown-item>
						<vs-dropdown-item @click="sizePage=10">
							<span>10</span>
						</vs-dropdown-item>
						<vs-dropdown-item @click="sizePage=15">
							<span>15</span>
						</vs-dropdown-item>
						<vs-dropdown-item @click="sizePage=20">
							<span>20</span>
						</vs-dropdown-item>
					</vs-dropdown-menu>
				</vs-dropdown>
				<div class="flex flex-wrap-reverse items-center data-list-btn-container">
					<div class="mb-4 rounded-lg flex items-center justify-center text-lg font-medium text-base text-primary">
						<vs-input 
                        icon-no-border 
						placeholder="Buscar pon DNI"
                        v-validate="'min:8|max:10|numeric'" 
                        v-model="numero"
                        v-on:keyup="searchData" 
                        class="w-full" 
                        icon="icon-search" icon-pack="feather" 
                        name="numero"/>
					</div>
				</div>
			</div>
            <template slot="thead">
                <vs-th>DNI</vs-th>
                <vs-th>Nombres</vs-th>
                <vs-th>Apellidos</vs-th>
                <vs-th>Telefono</vs-th>
                <vs-th>Oficina</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
				<vs-tr :key="indextr" v-for="(tr, indextr) in data">
					<vs-td :data="data[indextr].id">
						{{ data[indextr].personal.numeroDocumento }}
					</vs-td>
					<vs-td :data="data[indextr].id">
						{{ data[indextr].personal.nombres }}
					</vs-td>
					<vs-td :data="data[indextr].id">
						{{ data[indextr].personal.apellidos }}
					</vs-td>
					<vs-td :data="data[indextr].id">
						{{ data[indextr].personal.telefono }}
					</vs-td>
					<vs-td :data="data[indextr].id">
						{{ data[indextr].personal.oficinaAbreviatura }}
					</vs-td>
					<vs-td :data="data[indextr].id">
                        <vs-chip :color="getOrderStatusColor(data[indextr].estado.id)" class="product-order-status">{{data[indextr].estado.descripcion}}</vs-chip>
					</vs-td>
					<vs-td :data="data[indextr].id" class="whitespace-no-wrap">
						<feather-icon icon="CheckCircleIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current cursor-pointer" @click="editar(tr)"/>
                        <feather-icon icon="EyeIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current cursor-pointer" class="ml-2" @click="ver(tr)"/>
						<feather-icon icon="Trash2Icon" svgClasses="w-5 h-5 hover:text-primary stroke-current cursor-pointer" class="ml-2" @click="eliminar(tr)"/>
                    </vs-td>
				</vs-tr>
			</template>
        </vs-table>
        <div class="my-5">
            <vs-pagination
              :total="totalPage"
              v-model="currentx"
              :prev-icon="$vs.rtl ? 'arrow_forward' : 'arrow_back'"
              :next-icon="$vs.rtl ? 'arrow_back' : 'arrow_forward'" />
        </div>

        <vs-popup title="Confirmación" :active.sync="popupHabilitar">
            <p class="mb-4">¿Esta segura de habilitar la encuesta para {{ showdni }}?.</p>
            <vs-button @click="habilitar" color="primary" type="filled">Aceptar</vs-button>
            <vs-button @click="popupHabilitar=false" class="ml-4 mt-2" type="border" color="primary">Cancelar</vs-button>
        </vs-popup>
    </vx-card>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '@/constants/config'
export default {
    data(){
        return {
            numero:'',
            listaEncuestas: [],
            sizePage: 10,
			currentx: 1,
			totalPage: 0,
			totalElements: 0,
            titulo: '',
            subtitulo: '',

            popupHabilitar: false,
            idEncuesta: 0,
            showdni:''
        }
    },

    created(){
        this.listPersonales();
    },

    watch: {
		currentx(val, oldVal){
			this.updateList();
		},
		sizePage(val, oldVal){
			this.updateList();
		}
	},

    methods: {
        updateList(){
			if(this.numero.length > 1){
				this.searchData();
			} else {
				this.listPersonales();
			}
		},

        listPersonales(){
            this.$vs.loading();
			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/encuesta/ultimo/listar?page=${ this.currentx - 1 }&size=${ this.sizePage }`,
				method: 'GET' 
			}).then(response =>{
                this.$vs.loading.close();
				this.listaEncuestas = response.data.content;
				this.totalPage = parseInt(response.data.totalPages);
				this.totalElements = response.data.totalElements;

                this.titulo = response.data.content[0].campania.descripcion + ' (' + response.data.content[0].campania.estado.descripcion + ')' ;
                this.subtitulo = 'Desde ' + response.data.content[0].campania.fechaApertura + ' hasta ' + response.data.content[0].campania.fechaCierre;
			}).catch(erro =>{
				this.$vs.loading.close();
				this.notifyShow(erro.response.status);
			});
        },

        searchData(){
			if(this.numero.length > 1){
				this.$vs.loading();
				axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
				axios({
					url: `${apiUrl}/encuesta/ultimo/buscar/${ this.numero }?page=${ this.currentx - 1 }&size=${ this.sizePage }`,
					method: 'GET' 
				}).then(response =>{
					this.$vs.loading.close();
                    this.listaEncuestas = response.data.content;
                    this.totalPage = parseInt(response.data.totalPages);
                    this.totalElements = response.data.totalElements;

                    this.titulo = response.data.content[0].campania.descripcion + ' (' + response.data.content[0].campania.estado.descripcion + ')' ;
                    this.subtitulo = 'Desde ' + response.data.content[0].campania.fechaApertura + ' hasta ' + response.data.content[0].campania.fechaCierre;
				}).catch(erro =>{
					this.$vs.loading.close();
					this.notifyShow(erro.response.status);
				});
			} else {
				this.listPersonales();
			}
			
		},

        getOrderStatusColor(status) {
			if (status === 2 || status === 6)   return 'success'
			if (status === 3) return 'warning'
			if (status === 1)  return 'dark'
			return 'primary'
		},

        editar(data){
            if(data.estado.id === 3){
                this.idEncuesta = data.id;
                this.showdni = data.personal.numeroDocumento;
                this.popupHabilitar = true;
            } else {
                this.$vs.notify({
                    title: 'Info!!!',
                    text: 'La ficha de sintomatología está en estado ' + data.estado.descripcion,
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }
        },

        habilitar(){
            if(this.idEncuesta === 0){
                return;
            }

            this.$vs.loading();
			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/encuesta/ultimo/activar/${ this.idEncuesta }`,
				method: 'POST' 
			}).then(response =>{
                this.idEncuesta = 0;
                this.showdni = '';
                this.$vs.loading.close();
                this.popupHabilitar = false;
                if(response.data.success){
                    this.$vs.notify({
                        title: 'Info!!!',
                        text: response.data.msg,
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        color: 'success'
                    });
                    this.updateList();
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
                this.idEncuesta = 0;
                this.showdni = '';
                this.popupHabilitar = false;
				this.notifyShow(erro.response.status);
			});
        },

        ver(data){
            if(data.estado.id === 2 || data.estado.id === 6){
				this.$router.push({
					name: 'ficha',
					params: { id: data.id}
				}).catch(() => {})
			} else {
				this.$vs.notify({
					title: 'Info!!!',
					text: 'Ficha de SIntomatología no registrado.',
					iconPack: 'feather',
					icon: 'icon-alert-circle',
					color: 'danger'
				});
			}
        },

        eliminar(data){
            this.$vs.notify({
				title: 'Info!!!',
				text: 'Módulo en desarrollo...',
				iconPack: 'feather',
				icon: 'icon-alert-circle',
				color: 'success'
			});
        },

        notifyShow(status){
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
        }
    }
}
</script>