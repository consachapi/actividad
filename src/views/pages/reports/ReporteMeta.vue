<template>
    <div id="data-reporte-list-view">
        <vx-card class="mb-base" no-shadow card-border>
            <div class="flex items-end mb-2">
                <feather-icon icon="PieChartIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Metas y Actividades</span>
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
                <label class="text-sm opacity-100 font-bold">Seleccione Meta</label>
                <v-select :options="itemsMeta" v-model="metaSelected" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="producto">
                    <template v-slot:no-options="{ searching }">
                        <template v-if="searching">
                            No se encontraron resultados
                        </template>
                        <span v-else style="opacity: 0.5">No existen resultados</span>
                    </template>
                </v-select>
                <span class="text-danger text-sm" v-show="errors.has('area')">{{ errors.first('area') }}</span>
            </div>

            <vs-table stripe ref="table" :data="itemsReponsable" pagination :max-items="itemsPerPage" search id="div-with-reportm-loading" class="vs-con-loading__container" noDataText="No existen datos">
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
                    <vs-th class="text-dark"><div class="font-bold">META</div></vs-th>
                    <vs-th class="" v-for="(item, index) in days" :key="index">{{ item.getDate() }}</vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td class="p-2" :data="data[indextr].nombres">
                                <small class="text-dark">{{ data[indextr].nombres }}</small>
                            </vs-td>
                            <vs-td class="p-0" :data="data[indextr].meta">
                                <vs-chip transparent color="rgb(38, 187, 174)">
                                    <small class="text-rgb(38, 187, 174)">{{ metaSelected.value }}</small>
                                </vs-chip>
                            </vs-td>
                            <vs-td class="p-0" v-for="(item, index) in data[indextr].diarios" :key="index">
                                <vs-checkbox disabled icon-pack="feather" icon="icon-check" color="warning" v-model="item.diario"></vs-checkbox>
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>


            </vs-table>

            <div class="vx-col w-full">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="printer" icon-pack="feather" color="primary" icon="icon-printer" class="ml-auto mt-2">Generear Reporte</vs-button>
                </div>
            </div>

        </vx-card>

        <vs-popup title="Reporte" :active.sync="popupVerDocumento">
            <div style="border-radius:5px; border:1px solid #d5dbe0" class="mb-6">
                <embed :src="pdf" frameborder="0" width="100%" height="500px" type="application/pdf">
            </div>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <vs-button @click="popupVerDocumento=false" icon-pack="feather" icon="icon-check" color="primary" class="mb-2">Aceptar</vs-button>
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

            itemsMeta: [],
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
            metaSelected: { value: '0045', label: '0045 - CONSTRUCCION DE INFRAESTRUCTURA EDUCATIVA'},
            seletedMonth: null,
            anio: new Date().getFullYear(),

            month: [],
            days: [],

            popupVerDocumento: false,
            pdf: null
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

        this.getMeta();
    },

    mounted () {
        this.isMounted = true;

        this.getDaysInMonth(this.seletedMonth.value, this.anio);
        this.getResidentes(this.metaSelected.value, this.anio, this.seletedMonth.value);
    },

    watch:{
        seletedMonth(val){
            if(val !== null){
                this.getDaysInMonth(val.value, this.anio);
                this.getResidentes(this.metaSelected.value, this.anio, val.value);
            }
        },

        metaSelected(val){
           if(val !== null){
                this.getDaysInMonth(this.seletedMonth.value, this.anio);
                this.getResidentes(val.value, this.anio, this.seletedMonth.value);
            } 
        },
    },
    
    methods: {
        getMeta(){
            this.$vs.loading();
            this.$http.getMetasSelection()
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsMeta = response.data;
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getDaysInMonth(month, year){
            this.days = (new Array(31)).fill('').map((v, i)=>new Date(year, month - 1, i + 1)).filter( v => v.getMonth() === month - 1);
        },

        getResidentes(meta, anio, mes){
            this.$vs.loading({
                container: "#div-with-reportm-loading",
                scale: 0.6
            });
            this.$http.getResidentes(meta, anio, mes)
            .then(response => {
                if(response.status === 200){
                    this.$vs.loading.close('#div-with-reportm-loading > .con-vs-loading');
                    const data = response.data;
                    this.itemsReponsable = data;
                }
            }).catch(error => {
                this.$vs.loading.close('#div-with-reportm-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        printer(){
            this.$vs.loading();
            this.$http.generarReporte(this.metaSelected.value, this.anio, this.seletedMonth.value)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    var byteCharacters = atob(data);
                    var byteNumbers = new Array(byteCharacters.length);
                    for (var i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    var byteArray = new Uint8Array(byteNumbers);
                    var blob = new Blob([byteArray], { type: "application/pdf" });
                    const fileURL = URL.createObjectURL(blob);
                    this.pdf = fileURL;
                    this.popupVerDocumento = true;
                }
            }).catch(error => {
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
#data-reporte-list-view {
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
                //padding: 10px 2px;
            }
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