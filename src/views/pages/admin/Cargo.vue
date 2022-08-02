<template>
    <div id="data-parametro-cargo-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="flex items-end mb-2">
                <feather-icon icon="FileTextIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Registro de Cargos</span>
            </div>

            <vs-divider/>

            <vs-table stripe ref="table" :data="itemsCargo" pagination :max-items="itemsPerPage" search>
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    
                    <div class="flex flex-wrap-reverse items-center data-list-btn-container">
                        <div @click="nuevo" class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary">
                            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
                            <span class="ml-2 text-base text-primary">Agregar</span>
                        </div>
                    </div>

                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsCargo.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsCargo.length }} de {{ itemsCargo.length }}</span>
                            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
                        </div>
                        
                        <vs-dropdown-menu>
                            <vs-dropdown-item @click="itemsPerPage=5">
                            <span>5</span>
                            </vs-dropdown-item>
                            <vs-dropdown-item @click="itemsPerPage=10">
                            <span>10</span>
                            </vs-dropdown-item>
                            <vs-dropdown-item @click="itemsPerPage=25">
                            <span>25</span>
                            </vs-dropdown-item>
                            <vs-dropdown-item @click="itemsPerPage=50">
                            <span>50</span>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>

                </div>

                <template slot="thead">
                    <vs-th class="">ID</vs-th>
                    <vs-th class="">CARGO</vs-th>
                    <vs-th class="">ACCIONES</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].id">
                                {{data[indextr].id}}
                            </vs-td>
                            <vs-td :data="data[indextr].descripcion">
                                {{data[indextr].descripcion}}
                            </vs-td>
                            <vs-td class="whitespace-no-wrap">
                                <div class="vx-row-actions">
                                    <vs-button @click="editar(tr)" class="mr-1 ml-2" color="rgb(62, 201, 214)" type="filled" icon-pack="feather" icon="icon-edit" size="small"></vs-button>
                                    <vs-button @click="eliminar(tr)" color="danger" type="filled" icon-pack="feather" icon="icon-trash-2" size="small"></vs-button>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>

            </vs-table>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <p class="truncate text-sm">
                    Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsCargo.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsCargo.length }}</strong> de un total de <strong>{{ itemsCargo.length }}</strong> registros
                </p>
            </div>

        </vx-card>

        <vs-popup :title="titleCargo" :active.sync="popupCargo">
            <div class="vx-col w-full mb-2">
                <label class="text-sm opacity-75">Cargo</label>
                <vs-input class="w-full" v-model="inputCargo" v-validate="'required'" name="cargo" placeholder="Ingrese el cargo"/>
                <span class="text-danger text-sm" v-show="errors.has('cargo')">{{ errors.first('cargo') }}</span>
            </div>

            <div class="vx-col w-full">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="guardar" :disabled="!validateForm" icon-pack="feather" color="primary" icon="icon-save" class="ml-auto mt-2">Guardar</vs-button>
                    <vs-button @click="cancelar" icon-pack="feather" color="danger" type="border" icon="icon-x-circle"  class="ml-4 mt-2">Cancelar</vs-button>
                </div>
            </div>

        </vs-popup>

    </div>
</template>
<script>
export default {
    data(){
        return {
            itemsCargo: [],
            itemsPerPage: 10,
            isMounted: false,

            titleCargo: 'Nuevo cargo',
            popupCargo: false,
            idCargo: null,
            inputCargo: null
        }
    },

    computed: {
        currentPage () {
            if (this.isMounted) {
                return this.$refs.table.currentx;
            }
            return 0;
        },

        validateForm(){
            return !this.errors.any() && this.inputCargo !== null;
        }

    },

    mounted () {
        this.isMounted = true;

        this.getCargosAll();
    },

    methods: {
        nuevo(){
            this.titleCargo = 'Crear cargo';
            this.inputCargo = null;
            this.popupCargo = true;
        },

        getCargosAll(){
            this.$vs.loading();
            this.$http.listarCargo()
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsCargo = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        guardar(){
            if(this.inputCargo === null || this.inputCargo === ''){
                this.showMessageAlert('El campo cargo es obligatorio.');
                return;
            }

            if(this.idCargo === null){
                this.$vs.loading();
                this.$http.crearCargo(this.inputCargo.trim().toUpperCase())
                .then(response => {
                    this.$vs.loading.close();
                    if(response.status === 201){
                        this.inputCargo = null;
                        this.idCargo = null;
                        this.popupCargo = false;
                        this.getCargosAll();
                    }
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.showMessageError(error.response.status, error.response.data.message);
                });

            } else {
                this.$vs.loading();
                this.$http.editarCargo(this.idCargo, this.inputCargo.trim().toUpperCase())
                .then(response => {
                    this.$vs.loading.close();
                    if(response.status === 200){
                        this.inputCargo = null;
                        this.idCargo = null;
                        this.popupCargo = false;
                        this.getCargosAll();
                    }
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.showMessageError(error.response.status, error.response.data.message);
                });
            }
        },

        cancelar(){
            this.inputCargo = null;
            this.popupCargo = false;
        },

        editar(tr){
            this.titleCargo = 'Modificar cargo';
            this.idCargo = tr.id;
            this.inputCargo = tr.descripcion;
            this.popupCargo = true;
        },

        eliminar(tr){
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmación`,
                text: '¿Esta seguro de eliminar el registro?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: this.remove
            });
            this.idCargo = tr.id;
        },

        remove(){
            this.$vs.loading();
            this.$http.eliminarCargo(this.idCargo)
            .then(response => {
                this.$vs.loading.close();
                this.idCargo = null;
                this.getCargosAll();
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
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
                this.popupProducto = false;
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }
            if(status === 403){
                this.popupPaciente = false;
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
@import "@/assets/scss/vuexy/_variables.scss";
#data-parametro-cargo-view {
.vs-con-table {
    @media (max-width: 689px) {
        .vs-table--search {
            margin-left: 0;
            max-width: unset;
            width: 100%;

            .vs-table--search-input {
                width: 100%;
            }
        }
    }

    @media (max-width: 461px) {
        .items-per-page-handler {
            display: none;
        }
    }

    @media (max-width: 341px) {
        .data-list-btn-container {
            width: 100%;

            .dd-actions,
            .btn-add-new {
                width: 100%;
                margin-right: 0 !important;
            }
        }
    }

    .vs-table--header {
        display: flex;
        flex-wrap: wrap;
        margin-left: 0.0rem;
        margin-right: 0.0rem;
        > span {
            display: flex;
            flex-grow: 1;
        }

        .vs-table--search{
            padding-top: 0;

            .vs-table--search-input {
                padding: 1.0rem 2.5rem;
                font-size: 1rem;

                &+i {
                    left: 1rem;
                }

                &:focus+i {
                    left: 1rem;
                }
            }
        }
    }

    .vs-table {
        font-size: 0.88rem;
        font-weight: 400;
        tr {
            box-shadow: 0 4px 20px 0 rgba(0,0,0,.05);
            td {
                padding: 10;
            }
            td.td-check {
               padding: 20px !important;
            }
        }
    }

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

    .vs-table--pagination {
        justify-content: center;
    }
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