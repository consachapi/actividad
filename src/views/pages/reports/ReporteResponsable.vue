<template>
    <div id="data-reporte-responsable-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="flex items-end mb-2">
                <feather-icon icon="PieChartIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Responsables y Actividades</span>
            </div>

            <vs-divider/>

            <div class="vx-col w-full mb-4">
                <label class="text-sm opacity-100 font-bold">Seleccione el Mes</label>
                <v-select :options="itemsMonths" v-model="seletedMonth" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="producto">
                    <template v-slot:no-options="{ searching }">
                        <template v-if="searching">
                            No se encontraron resultados
                        </template>
                        <span v-else style="opacity: 0.5">No existen resultados</span>
                    </template>
                </v-select>
                <span class="text-danger text-sm" v-show="errors.has('area')">{{ errors.first('area') }}</span>
            </div>

            <div class="vx-col w-full mb-4">
                <label class="text-sm opacity-100 font-bold">Area o Gerencia/SubGerencia</label>
                <v-select :options="itemsOficina" v-model="selectedOficina" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="producto">
                    <template v-slot:no-options="{ searching }">
                        <template v-if="searching">
                            No se encontraron resultados
                        </template>
                        <span v-else style="opacity: 0.5">No existen resultados</span>
                    </template>
                </v-select>
                <span class="text-danger text-sm" v-show="errors.has('area')">{{ errors.first('area') }}</span>
            </div>

            <div class="vx-col w-full">
                <div class="flex flex-wrap items-center justify-end mb-6">
                    <vs-button @click="procesar" icon-pack="feather" color="primary" icon="icon-play" class="ml-auto mt-2">Procesar</vs-button>
                </div>
            </div>

            <vs-table stripe ref="table" :data="itemsReponsable" pagination :max-items="itemsPerPage" search id="div-with-report-loading" class="vs-con-loading__container" noDataText="No existen datos">
                <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
                    <vs-dropdown vs-trigger-click class="cursor-pointer mb-4 mr-4 items-per-page-handler">
                        <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
                            <span class="mr-2">{{ currentPage * itemsPerPage - (itemsPerPage - 1) }} - {{ itemsReponsable.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsReponsable.length }} de {{ itemsReponsable.length }}</span>
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
                    <vs-th class="p-4 text-dark"><div class="font-bold">NOMBRES</div></vs-th>
                    <vs-th class="p-4 text-dark"><div class="font-bold">CARGO</div></vs-th>
                    <vs-th class="" v-for="(item, index) in days" :key="index">{{ item.getDate() }}</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td class="p-2" :data="data[indextr].nombres">
                                <span @click="showDetail(tr)" class="font-bold hover:text-primary cursor-pointer">
                                    <small class="">{{ data[indextr].nombres }}</small>
                                </span>
                            </vs-td>
                            <vs-td class="p-2" :data="data[indextr].nombres">
                                <small class="text-dark">{{ data[indextr].ndocumento.split('|')[1] }}</small>
                            </vs-td>
                            <vs-td class="p-0" v-for="(item, index) in data[indextr].diarios" :key="index">
                                <vs-checkbox disabled icon-pack="feather" icon="icon-check" color="warning" v-model="item.diario"></vs-checkbox>
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>


            </vs-table>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <p class="truncate text-sm">
                    Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsReponsable.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsReponsable.length }}</strong> de un total de <strong>{{ itemsReponsable.length }}</strong> registros
                </p>
            </div>

        </vx-card>

        <vs-popup title="Metas Asignadas" :active.sync="popupDetalleResponsable" id="data-reporte-responsable-view">
            <div class="vx-row">
                <div class="vx-col w-full md:w-1/3">
                    <span class="flex flex-wrap-reverse justify-end"><strong>Nro de documento:</strong></span>
                </div>
                <div class="vx-col w-full md:w-2/3">
                    <span class=""> {{ ndocumento }} </span>
                </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full md:w-1/3">
                    <span class="flex flex-wrap-reverse justify-end"><strong>Apellidos:</strong></span>
                </div>
                <div class="vx-col w-full md:w-2/3">
                    <span class=""> {{ apellidos }} </span>
                </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full md:w-1/3">
                    <span class="flex flex-wrap-reverse justify-end"><strong>Nombres:</strong></span>
                </div>
                <div class="vx-col w-full md:w-2/3">
                    <span class=""> {{ nombres }} </span>
                </div>
            </div>

            <div class="vx-row mb-4">
                <div class="vx-col w-full md:w-1/3">
                    <span class="flex flex-wrap-reverse justify-end"><strong>Cargo:</strong></span>
                </div>
                <div class="vx-col w-full md:w-2/3">
                    <span class=""> {{ cargo }} </span>
                </div>
            </div>

            <vs-table stripe ref="table" :data="itemsMeta" noDataText="No existen datos">
                <template slot="thead">
                    <vs-th class="p-4 text-dark"><div class="font-bold">META</div></vs-th>
                    <vs-th class="p-4 text-dark"><div class="font-bold">COD. PROY/PROD</div></vs-th>
                    <vs-th class="p-4 text-dark"><div class="font-bold">PROYECTO/PRODUCTO</div></vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td class="p-2" :data="data[indextr].meta">
                                 <small class="text-dark">{{ data[indextr].meta }}</small>
                            </vs-td>
                            <vs-td class="p-2" :data="data[indextr].nombres">
                                <small class="text-dark">{{ data[indextr].codigoProductoProyecto }}</small>
                            </vs-td>
                            <vs-td class="p-2" :data="data[indextr].nombres">
                                <small class="text-dark">{{ data[indextr].productoProyecto }}</small>
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>

            </vs-table>

            <vs-divider/>
            <div class="vx-col w-full">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="popupDetalleResponsable=false" icon-pack="feather" color="primary" icon="icon-thumbs-up" class="ml-auto mt-2">Aceptar</vs-button>
                </div>
            </div>
        </vs-popup>

    </div>
</template>
<script>
import vSelect from 'vue-select';
export default {
    components: {
        vSelect
    },
    data(){
        return {
            itemsReponsable: [],
            itemsPerPage: 10,
            isMounted: false,

            itemsMonths: [
                { value: 1, label: 'Enero' },
                { value: 2, label: 'Febrero' },
                { value: 3, label: 'Marzo' },
                { value: 4, label: 'Abril' },
                { value: 5, label: 'Mayo' },
                { value: 6, label: 'Junio' },
                { value: 7, label: 'Julio' },
                { value: 8, label: 'Agosto' },
                { value: 9, label: 'Setiembre' },
                { value: 10, label: 'Octubre' },
                { value: 11, label: 'Noviembre' },
                { value: 12, label: 'Diciembre' },
            ],

            seletedMonth: null,
            anio: new Date().getFullYear(),

            itemsOficina: [],
            selectedOficina: null,

            month: [],
            days: [],

            popupDetalleResponsable: null,
            ndocumento: null,
            apellidos: null,
            nombres: null,
            cargo: null,
            itemsMeta: []
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

    created(){
        let mes = this.itemsMonths.find(mes => mes.value === new Date().getMonth() + 1);
        this.seletedMonth = { value: new Date().getMonth() + 1, label: mes.label };

        this.getOficina();
    },

    mounted() {
        this.isMounted = true;
    },

    watch: {
        seletedMonth(val){
            if(val !== null){
                this.getDaysInMonth(val.value, this.anio);
            }
        },
    },

    methods: {
        getOficina(){
            this.$vs.loading();
            this.$http.listOficinaActivo()
            .then(response => {
                if(response.status === 200){
                    this.$vs.loading.close();
                    this.itemsOficina = response.data;
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        procesar(){
            if(this.selectedOficina === null){
                this.$vs.dialog({
                    type: 'alert',
                    color: 'danger',
                    title: `Aviso`,
                    text: 'Seleccione la Dependencia, Gerencia o Sub Gerencia .',
                    acceptText: 'Aceptar',
                });
                return;
            }

            this.getResidentes(this.selectedOficina.value, this.anio, this.seletedMonth.value);
        },

        getDaysInMonth(month, year){
            this.days = (new Array(31)).fill('').map((v, i)=>new Date(year, month - 1, i + 1)).filter( v => v.getMonth() === month - 1);
        },

        getResidentes(oficina, anio, mes){
            this.$vs.loading({
                container: "#div-with-report-loading",
                scale: 0.6
            });
            this.$http.getAllResidentes(oficina, anio, mes)
            .then(response => {
                if(response.status === 200){
                    this.$vs.loading.close('#div-with-report-loading > .con-vs-loading');
                    const data = response.data;
                    this.itemsReponsable = data;
                }
            }).catch(error => {
                this.$vs.loading.close('#div-with-report-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        showDetail(tr){
            const ndocumento = tr.ndocumento.split('|')[0];
            this.$vs.loading({
                container: "#div-with-report-loading",
                scale: 0.6
            });
            this.$http.searchMetaByReponsable(ndocumento)
            .then(response => {
                if(response.status === 200){
                    this.$vs.loading.close('#div-with-report-loading > .con-vs-loading');
                    const data = response.data;

                    this.ndocumento = data.numDocumento;
                    this.apellidos = data.apellidos;
                    this.nombres = data.nombres;
                    this.cargo = data.cargo.descripcion;
                    this.itemsMeta = data.metas;
                    this.popupDetalleResponsable = true;
                }
            }).catch(error => {
                this.$vs.loading.close('#div-with-report-loading > .con-vs-loading');
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
#data-reporte-responsable-view {
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

        .vs-table--search {
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
            td.td-check {
               padding: 20px !important;
            }
        }
    }

    .vs-table--thead{
        th {
            padding: 10px 5px;
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
</style>