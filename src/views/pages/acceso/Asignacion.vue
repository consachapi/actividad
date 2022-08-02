<template>
    <div id="data-persona-list-asignacion-view">
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
                </div>

                <template slot="thead">
                    <vs-th>Nro doc.</vs-th>
                    <vs-th>Nombres</vs-th>
                    <vs-th>Apellidos</vs-th>
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
                            <div @click="asignar(tr)" class="btn-add-new p-2 mb-2 mt-2 cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                                <feather-icon icon="CheckCircleIcon" svgClasses="h-5 w-5" />
                                <span class="ml-2 text-base text-primary">Asignar</span>
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

        <vs-popup id="modal-asignacion-proyecto" title="Asignación de metas" :active.sync="popupAsignacionProyecto">
            <ag-grid-vue
                ref="agGridTable"
                :gridOptions="gridOptions"
                class="ag-theme-material w-100 my-4 ag-grid-table"
                :columnDefs="columnDefs"
                :defaultColDef="defaultColDef"
                :rowData="itemsMeta"
                rowSelection="multiple"
                :suppressRowClickSelection="true"
                colResizeDefault="shift"
                :animateRows="true"
                :floatingFilter="true"
                :pagination="true"
                :isRowSelectable="isRowSelectable"
                :suppressPaginationPanel="true"
                :enableRtl="$vs.rtl">
            </ag-grid-vue>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-start">
                <div class="mb-4 rounded-lg flex items-center justify-center text-lg font-medium text-base">
                    <p class="truncate text-sm">
                        Mostrando registro del {{ currentPage * paginationPageSize - (paginationPageSize - 1) }} al {{ itemsMeta.length - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : itemsMeta.length }} de un total de {{ itemsMeta.length }} registros
                    </p>
				</div>
                <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                    <vs-pagination
                    :total="totalPages"
                    :max="7"
                    v-model="currentPage" />
				</div>
            </div>

            <vs-divider/>

            <div class="vx-row">
				<div class="vx-col w-full">
					<div class="mt-2 flex flex-wrap items-center justify-end">
						<vs-button @click="guardar" icon-pack="feather" icon="icon-save" class="ml-auto mt-2">Guardar</vs-button>
                        <vs-button @click="popupAsignacionProyecto=false" icon-pack="feather" icon="icon-x-circle" class="ml-4 mt-2" type="border" color="primary">Cancelar</vs-button>
					</div>
				</div>
			</div>
        </vs-popup>

    </div>
</template>
<script>
import { AgGridVue } from 'ag-grid-vue';
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss';

export default {
    components: {
        AgGridVue
    },

    data(){
        return {
            numero:'',
            listaPersona:[],
			sizePage: 10,
			currentx: 1,
			totalPage: 0,
			totalElements: 0,

            ndocumento: null,
            popupAsignacionProyecto: false,

            itemsMeta: [],
            gridApi: null,
            gridOptions: {},
            defaultColDef: {
                sortable: true,
                resizable: true,
                suppressMenu: true
            },
            isRowSelectable: null,
            columnDefs: [
                {
                    headerName: 'META',
                    field: 'meta',
                    width: 130,
                    filter: true,
                    checkboxSelection: true,
                    headerCheckboxSelectionFilteredOnly: true,
                    headerCheckboxSelection: true,
                }, {
                    headerName: 'COD. PROY/PROD',
                    field: 'cproyecto',
                    tooltipField: 'cproyecto',
                    filter: true,
                    width: 165,
                }, {
                    headerName: 'PROYECTO/PRODUCTO',
                    field: 'proyecto',
                    tooltipField: 'proyecto',
                    filter: true,
                    width: 400,
                },
            ],

            backgroundLoading:'primary',
            colorLoading:'#fff',
        }
    },

    computed: {
        paginationPageSize () {
            if (this.gridApi) return this.gridApi.paginationGetPageSize()
            else return 10
        },

        totalPages () {
            if (this.gridApi) return this.gridApi.paginationGetTotalPages()
            else return 0
        },

        currentPage: {
            get () {
                if (this.gridApi) return this.gridApi.paginationGetCurrentPage() + 1
                else return 1
            },
            set (val) {
                this.gridApi.paginationGoToPage(val - 1)
            }
        }
    },

    mounted(){
        this.getPersona();
        this.gridApi = this.gridOptions.api;
        if (this.$vs.rtl) {
            const header = this.$refs.agGridTable.$el.querySelector('.ag-header-container')
            header.style.left = `-${  String(Number(header.style.transform.slice(11, -3)) + 9)  }px`
        }
    },

    beforeMount(){
        this.isRowSelectable = (rowNode) => {
            rowNode.setSelected(rowNode.data.asignacion);
            return true;
        };
        
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

        asignar(tr){
            if(!tr.enable){
                this.$vs.dialog({
                    type: 'alert',
                    color: 'danger',
                    title: `Aviso`,
                    text: 'El usuario esta bloqueado.',
                    acceptText: 'Aceptar',
                });
                return;
            }

            this.$vs.loading();
            this.$http.metasAsignados(tr.numDocumento)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsMeta = response.data;
					this.popupAsignacionProyecto = true;
                    this.ndocumento = tr.numDocumento;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.data.status, error.response.data.message);
            });
        },

        guardar(){
            const asignados = [];
            this.gridApi.forEachNode((node) => {
                if(node.isSelected()){
                    asignados.push(node.data);
                }
            });

            if(asignados.length === 0){
                this.showMessageAlert("Seleccione al menos una meta.");
                return;
            }

            if(this.ndocumento === null){
                this.showMessageAlert("Seleccione al responsable.");
                return;
            }

            this.$vs.loading();
            this.$http.asignarMetas(this.ndocumento, asignados)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 201){
					this.popupAsignacionProyecto = false;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.data.status, error.response.data.message);
            });
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
#data-persona-list-asignacion-view {
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

#modal-asignacion-proyecto {
    .vs-popup {
        transition: all .2s;
        z-index: 100;
        width: 740px;
        margin: 10px;
        max-width: calc(100% - 30px);
        max-height: calc(100% - 30px);
        border-radius: 6px;
    }
    .vs-popup--background{
        width: 40000px;
        height: 40000px;
    } 
}
</style>