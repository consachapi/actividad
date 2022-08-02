<template>
    <div id="data-parametro-meta-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="flex items-end mb-2">
                <feather-icon icon="ActivityIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Rigistro de Metas</span>
            </div>

            <vs-divider/>

            <div class="vx-col w-full mb-base">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="sincronizar" icon-pack="feather" color="primary" icon="icon-refresh-cw" class="ml-auto mt-2 vs-con-loading__container" id="button-sincr-with-loading">Actualizar</vs-button>
                </div>
            </div>

            <vs-table stripe ref="table" :data="itemsMeta" pagination :max-items="itemsPerPage" search>
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsMeta.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsMeta.length }} de {{ itemsMeta.length }}</span>
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
                    <vs-th class="">META</vs-th>
                    <vs-th class="">COD. PRY/PROD</vs-th>
                    <vs-th class="">PROY/PRODUCTO</vs-th>
                    <vs-th class="">FUNCION</vs-th>
                    <vs-th class="">GRUPO FUNCIONAL</vs-th>
                    <vs-th class="">DIVISION FUNCIONAL</vs-th>
                    <vs-th class="">PROGRAMA</vs-th>
                    <vs-th class="">ESTADO</vs-th>
                    <vs-th class="">ACCIONES</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].meta">
                                {{data[indextr].meta}}
                            </vs-td>
                            <vs-td :data="data[indextr].codigoProductoProyecto">
                                {{ data[indextr].codigoProductoProyecto }}
                            </vs-td>
                            <vs-td :data="data[indextr].productoProyecto">
                                {{ data[indextr].productoProyecto }}
                            </vs-td>
                            <vs-td :data="data[indextr].funcion">
                                {{ data[indextr].funcion }}
                            </vs-td>
                            <vs-td :data="data[indextr].grupoFuncional">
                                {{ data[indextr].grupoFuncional }}
                            </vs-td>
                            <vs-td :data="data[indextr].divisionFuncional">
                                {{ data[indextr].divisionFuncional }}
                            </vs-td>
                            <vs-td :data="data[indextr].programa">
                                {{ data[indextr].programa }}
                            </vs-td>
                            <vs-td :data="data[indextr].enable">
                                <vs-chip transparent :color="getOrderStatusColor(data[indextr].estado)">
                                    <span class="font-medium truncate"> {{ data[indextr].estado ? 'Habilitado' : 'Inhabilitado' }}</span>
                                </vs-chip>
                            </vs-td>
                            <vs-td :data="data[indextr].meta" class="whitespace-no-wrap">
                                <div class="vx-row-actions">
                                    <vs-button v-if="!data[indextr].estado" @click="enabled(tr)" class="mr-1 ml-2" color="rgb(62, 201, 214)" type="filled" icon-pack="feather" icon="icon-thumbs-up" size="small"></vs-button>
                                    <vs-button v-if="data[indextr].estado" @click="disabled(tr)" color="danger" type="filled" icon-pack="feather" icon="icon-thumbs-down" size="small"></vs-button>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>

            </vs-table>

        </vx-card>
    </div>
</template>
<script>
export default {
    data(){
        return {
            itemsMeta: [],
            itemsPerPage: 10,
            isMounted: false,

            numeroMeta: null,

            backgroundLoading: 'primary',
            colorLoading: '#fff',
        }
    },

    computed: {
        currentPage () {
            if (this.isMounted) {
                return this.$refs.table.currentx;
            }
            return 0;
        },
    },

    mounted () {
        this.isMounted = true;

        this.getMetasAll();
    },

    methods: {
        getMetasAll(){
            this.$vs.loading();
            this.$http.listarMetasTodo()
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsMeta = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        enabled(tr){
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmación`,
                text: '¿Esta seguro de habilitar la meta ' + tr.meta + '?',
                acceptText: 'Si',
                cancelText: 'No',
                accept: this.habilitar
            });
            this.numeroMeta = tr.meta;
        },

        habilitar(){
            this.$vs.loading();
            this.$http.habilitar(this.numeroMeta)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.showMessageSuccess('Se habilitó de forma correcta.');
                    this.getMetasAll();
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        disabled(tr){
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmación`,
                text: '¿Esta seguro de inhabilitar la meta ' + tr.meta + '?',
                acceptText: 'Si',
                cancelText: 'No',
                accept: this.inhabilitar
            });
            this.numeroMeta = tr.meta;
        },

        inhabilitar(){
            this.$vs.loading();
            this.$http.inhabilitar(this.numeroMeta)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.showMessageSuccess('Se inhabilitó de forma correcta.');
                    this.getMetasAll();
                }
            })
            .catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        sincronizar(){
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-sincr-with-loading",
                scale: 0.45
            });
            //this.$vs.loading.close("#button-sincr-with-loading > .con-vs-loading");
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
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }
            if(status === 403){
                this.popupPaciente = false;
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
#data-parametro-meta-view {
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