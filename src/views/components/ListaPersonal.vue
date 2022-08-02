<template>
    <vx-card title="Registro de Trabajadores">
        <vs-table stripe :data="listaPersonal">
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
				<div class="flex flex-wrap-reverse items-center flex-grow justify-end">
					<div class="btn-add-new p-2 mb-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary" @click="addNewPersonal">
						<feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
						<span class="ml-2 text-base text-primary">Nuevo</span>
					</div>
				</div>
			</div>
			
            <template slot="thead">
                <vs-th>DNI</vs-th>
                <vs-th>Nombres</vs-th>
                <vs-th>Apellidos</vs-th>
                <vs-th>Email</vs-th>
                <vs-th>Oficina</vs-th>
                <vs-th>Telefono</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
			<template slot-scope="{data}">
				<vs-tr :key="indextr" v-for="(tr, indextr) in data">
					<vs-td :data="data[indextr].numeroDocumento">
						{{ data[indextr].numeroDocumento }}
					</vs-td>
					<vs-td :data="data[indextr].numeroDocumento">
						{{ data[indextr].nombres }}
					</vs-td>
					<vs-td :data="data[indextr].numeroDocumento">
						{{ data[indextr].apellidos }}
					</vs-td>
					<vs-td :data="data[indextr].numeroDocumento">
						{{ data[indextr].email }}
					</vs-td>
					<vs-td :data="data[indextr].numeroDocumento">
						{{ data[indextr].oficinaAbreviatura }}
					</vs-td>
					<vs-td :data="data[indextr].numeroDocumento">
						{{ data[indextr].telefono }}
					</vs-td>
					<vs-td :data="data[indextr].numeroDocumento" class="whitespace-no-wrap">
						<feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current cursor-pointer" @click="editar(tr)"/>
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
    </vx-card>
</template>
<script>
import axios from 'axios';
import { apiUrl } from '@/constants/config'
export default {
    data(){
        return {
			numero:'',
            listaPersonal:[],
			sizePage: 10,
			currentx: 1,
			totalPage: 0,
			totalElements: 0
        }
    },
    created(){
        this.getPersonales();
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
				this.getPersonales();
			}
		},
		
		searchData(){
			if(this.numero.length > 1){
				this.$vs.loading();
				axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
				axios({
					url: `${apiUrl}/usuario/personal/buscar/${ this.numero }?page=${ this.currentx - 1 }&size=${ this.sizePage }`,
					method: 'GET' 
				}).then(response =>{
					this.$vs.loading.close();
					this.listaPersonal = response.data.content;
					this.totalPage = parseInt(response.data.totalPages);
					this.totalElements = response.data.totalElements
				}).catch(erro =>{
					this.$vs.loading.close();
					this.notifyShow(erro.response.status);
				});
			} else {
				this.getPersonales();
			}
			
		},
        getPersonales(){
            this.$vs.loading();
			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/usuario/personal/listar?page=${ this.currentx - 1 }&size=${ this.sizePage }`,
				method: 'GET' 
			}).then(response =>{
                this.$vs.loading.close();
				this.listaPersonal = response.data.content;
				this.totalPage = parseInt(response.data.totalPages);
				this.totalElements = response.data.totalElements;
			}).catch(erro =>{
				this.$vs.loading.close();
				this.notifyShow(erro.response.status);
			});
        },

        addNewPersonal(){
            this.$router.push({
				name: 'mostrar',
				params: { id: 'nuevo'}
			}).catch(() => {})
        },

		editar(data){
            this.$router.push({
				name: 'mostrar',
				params: { id: data.numeroDocumento}
			}).catch(() => {})
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