<template>
    <div id="data-persona-list-view">
        <vx-card title="" class="mb-base" no-shadow card-border>
            <div class="flex items-end">
                <feather-icon icon="UsersIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Lista de Personal</span>
            </div>

            <vs-divider/>

            <vs-table stripe :data="listaPersona" id="div-persona-with-loading" class="vs-con-loading__container">
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-start">
                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
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
                            <vs-dropdown-item @click="sizePage=25">
                                <span>25</span>
                            </vs-dropdown-item>
                            <vs-dropdown-item @click="sizePage=50">
                                <span>50</span>
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
                            class="w-full vs-input-common-search"
                            icon="icon-search" icon-pack="feather" 
                            name="numero"/>
                        </div>
                    </div>
                    <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                        <div @click="nuevoPersona" class="btn-add-new p-3 mb-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                            <span class="ml-2 text-base text-primary">Nuevo</span>
                        </div>
                    </div>
                </div>

                <template slot="thead">
                    <vs-th>Nro doc.</vs-th>
                    <vs-th>Nombres</vs-th>
                    <vs-th>Apellidos</vs-th>
                    <vs-th>Email</vs-th>
                    <vs-th>Cargo</vs-th>
                    <vs-th>Perfil</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].numDocumento">
                            {{ data[indextr].numDocumento }}
                        </vs-td>
                        <vs-td :data="data[indextr].nombres">
                            {{ data[indextr].nombres }}
                        </vs-td>
                        <vs-td :data="data[indextr].apellidos">
                            {{ data[indextr].apellidos }}
                        </vs-td>
                        <vs-td :data="data[indextr].email">
                            {{ data[indextr].email }}
                        </vs-td>
                        <vs-td :data="data[indextr].cargo">
                            {{ data[indextr].cargo.descripcion }}
                        </vs-td>
                        <vs-td :data="data[indextr].perfil">
                            {{ data[indextr].perfil.descripcion }}
                        </vs-td>
                        <vs-td :data="data[indextr].enable">
                            <vs-chip transparent :color="getOrderStatusColor(data[indextr].enable)">
                                <span class="font-medium truncate"> {{ data[indextr].enable ? 'Activo' : 'Bloqueado' }}</span>
                            </vs-chip>
                        </vs-td>
                        <vs-td :data="data[indextr].numDocumento" class="whitespace-no-wrap">
                            <div class="vx-row-actions">
                                <vs-button @click="editar(tr)" class="mr-1 ml-2" color="rgb(62, 201, 214)" type="filled" icon-pack="feather" icon="icon-edit" size="small"></vs-button>
                                <vs-button @click="eliminar(tr)" color="danger" type="filled" icon-pack="feather" icon="icon-trash-2" size="small"></vs-button>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>

            </vs-table>

            <div class="my-5">
                <div class="flex flex-wrap-reverse items-center flex-grow justify-start">
                    <div class="mb-2 rounded-lg flex items-center justify-center text-lg font-medium text-base">
                        <p class="truncate text-sm">
                            Mostrando registros del <strong>{{ currentx * sizePage - (sizePage - 1) }}</strong> al <strong>{{ totalElements - currentx * sizePage > 0 ? currentx * sizePage : totalElements }}</strong> de un total de <strong>{{ totalElements }}</strong> registros
                        </p>
                    </div>
                    <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                        <vs-pagination
                            :total="totalPage"
                            v-model="currentx"
                            :prev-icon="$vs.rtl ? 'arrow_forward' : 'arrow_back'"
                            :next-icon="$vs.rtl ? 'arrow_back' : 'arrow_forward'" />
                    </div>
                </div>
            </div>

        </vx-card>

        <vs-popup title="Confirmación" :active.sync="popupEliminarPersonal">
            <p>¿Esta seguro de eliminar el personal?</p>

            <div class="mt-8">
                <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                    <vs-button @click="eliminarPersona" ref="loadableButton" id="button-with-loading" class="vs-con-loading__container mb-2" icon-pack="feather" icon="icon-check" color="danger">Aceptar</vs-button>
                    <vs-button @click="cancelarPersona" icon-pack="feather" icon="icon-x-circle" color="danger" type="border" class="mb-2 ml-2">Cancelar</vs-button>
                </div>
            </div> 
        </vs-popup>

    </div>
</template>
<script>
export default {
    data(){
        return {
            numero:'',
            listaPersona:[],
			sizePage: 10,
			currentx: 1,
			totalPage: 0,
			totalElements: 0,

            ndocumento: null,
            popupEliminarPersonal: false,

            backgroundLoading:'primary',
            colorLoading:'#fff',
        }
    },

    mounted(){
        this.getPersona();
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
				this.getPersona();
			}
        },

        searchData(){
            if(this.numero.length > 1){
                const payload = {
                    numero: this.numero,
                    currentx: this.currentx,
                    sizePage: this.sizePage
                }
                this.$vs.loading({
                    container: '#div-persona-with-loading',
                    scale: 0.7
                });
                this.$http.buscarPersonal(this.numero, this.currentx, this.sizePage)
                .then(response => {
                    this.$vs.loading.close('#div-persona-with-loading > .con-vs-loading');
                    if(response.status === 200){
                        this.listaPersona = response.data.content;
                        this.totalPage = parseInt(response.data.totalPages);
                        this.totalElements = response.data.totalElements;
                    }
                })
                .catch(error => {
                    this.$vs.loading.close('#div-persona-with-loading > .con-vs-loading');
                    this.showMessageError(error.response.status, error.response.data.message);
                });
            } else {
                this.getPersona();
            }
        },

        getPersona(){
            this.$vs.loading({
                container: '#div-persona-with-loading',
                scale: 0.7
            });
            this.$http.getAllPersonal(this.currentx, this.sizePage)
            .then(response => {
                this.$vs.loading.close('#div-persona-with-loading > .con-vs-loading');
                if(response.status === 200){
                    this.listaPersona = response.data.content;
                    this.totalPage = parseInt(response.data.totalPages);
					this.totalElements = response.data.totalElements;
                }
            })
            .catch(error => {
                this.$vs.loading.close('#div-persona-with-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        nuevoPersona(){
            this.$router.push({
				name: 'usuario-acceso-personal-detalle',
				params: { id: 'nuevo'}
			}).catch(() => {});
        },

        editar(tr){
            this.$router.push({
				name: 'usuario-acceso-personal-detalle',
				params: { id: tr.numDocumento}
			}).catch(() => {});
        },

        eliminar(tr){
            if(!tr.enable){
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'warning',
                    title: `Confirmación`,
                    text: 'Personal con Nro Documento ' + tr.numDocumento + ' ya esta bloqueado.',
                    acceptText: 'Aceptar',
                });
                return;
            }
            this.ndocumento = tr.numDocumento;
            this.popupEliminarPersonal = true;
        },

        eliminarPersona(){
            this.$vs.loading();
            this.$http.deletePersona(this.ndocumento)
            .then(response => {
                this.$vs.loading.close();
                this.showMessageSuccess("Bloqueado de forma correcta.");
                this.updateList();
                this.ndocumento = null;
                this.popupEliminarPersonal = false;
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.data.status, error.response.data.message);
            });
        },

        cancelarPersona(){
            this.ndocumento = null;
            this.popupEliminarPersonal = false;
        },

        getOrderStatusColor (status) {
            if (status) return 'success'
            return 'danger'
        },

        showMessageAlert(message){
            this.$vs.notify({
                title: 'Aviso',
                text: message,
                position:'top-center',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
            });
        },

        showMessageSuccess(message){
            this.$vs.notify({
                title: 'Información',
                text: message,
                position:'top-right',
                iconPack: 'feather',
                icon: 'icon-check',
                color: 'success'
            });
        },

        showMessageError(status, message){
            if(status === 400 || status === 409){
                this.$vs.notify({
                    title: 'Aviso',
                    text: message,
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                });
            }
            if(status === 401){
                this.popupRiesgo = false;
                this.popupEliminar = false;
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }
            if(status === 403){
                this.popupRiesgo = false;
                this.popupEliminar = false;
                this.$vs.notify({
                    title: 'ACCESO DENEGADO',
                    text: 'No tiene permisos para esta proceso.',
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }
            if(status === 404){
                this.$vs.notify({
                    title: 'Aviso',
                    text: message,
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                });
            }
            if(status === 417){
                this.$vs.notify({
                    title: 'ALERTA',
                    text: message,
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }

            if(status === 500){
                this.$vs.notify({
                    title: 'ERROR',
                    text: 'Ups!!!. Ocurrio un error. Vuelve a intentarlo.',
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    color: 'danger'
                });
            }
        },
    }
}
</script>
<style lang="scss">
#data-persona-list-view {
    .vs-con-table {
        
        .vs-table--tbody-table {
            font-size: 0.88rem;
            font-weight: 400;
            .vs-table--thead{
                th {
                    padding: 10;
                    background: #d9d8d8;
            
                    &:first-child{
                        border-top-left-radius: .3rem;
                        border-bottom-left-radius: .3rem;
                    }
                    &:last-child{
                        border-top-right-radius: .3rem;
                        border-bottom-right-radius: .3rem;
                    }
                    .vs-table-text{
                        text-transform: uppercase;
                        font-weight: 600;
                    }
                }
                th.td-check{
                    padding: 0 15px !important;
                }
                tr{
                    background: none;
                    box-shadow: none;
                }
            }
        }
    }
    .vs-con-input{
        input {
            border-radius: 30px;
            padding: .8rem 1rem 0.8rem 3rem ;
        }
        .input-span-placeholder {
            padding-left: 3rem ;
            padding-top: .75rem ;
        }
        .vs-icon {
            margin-top: .3rem ;
            margin-left: 0.6rem ;
            font-size: 1rem ;
        }
        &:first-child{
            border-top-left-radius: 1.9rem;
            border-bottom-left-radius: .3rem;
        }
        &:last-child{
            border-top-right-radius: .3rem;
            border-bottom-right-radius: .3rem;
        }
    }
}

.vs-input-common-search {
    .vs-input--input.hasIcon {
        padding: 1.0rem 2.5rem !important;
    }
    .vs-input--placeholder.normal {
        margin-top: 0.3rem;
    }
}

.vx-row-actions {
  display: flex;
  flex-wrap: nowrap;
  margin: 0 -1rem;

  & > .vx-col {
    padding: 0 1rem;
  }

  &.match-height>.vx-col {
    display: flex;
  }

  &.no-gutter {
    margin: 0;

    & > .vx-col {
      padding: 0;
    }
  }
}
</style>