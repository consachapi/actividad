<template>
    <div id="data-metas-list-view">
        <vx-card class="mb-base" no-shadow card-border>

            <div class="flex items-end mb-2">
                <feather-icon icon="FileIcon" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">Metas y Actividades</span>
            </div>

            <vs-divider/>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-start">
                <div class="mb-4">
                    <label class="text-sm opacity-100 font-medium">Fecha</label>
                    <datepicker :disabledDates="disabledDatesInicio" :language="es" v-model="inputFecha" format="dd/MM/yyyy" v-validate="'required'" name="fecha"></datepicker>
                    <span class="text-danger text-sm" v-show="errors.has('fecha')">{{ errors.first('fecha') }}</span>
                </div>
                <div class="flex flex-wrap items-center justify-end ml-2">
                    <vs-button @click="buscarPorFecha" icon-pack="feather" color="primary" icon="icon-search" class="ml-auto mt-2">Buscar</vs-button>
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
                    <vs-th class=""><div class="font-bold">META</div></vs-th>
                    <vs-th v-for="i in lengthHeader" :key="i" class=""></vs-th>
                    <vs-th class=""></vs-th>
                    <vs-th class=""></vs-th>
                    <vs-th class=""></vs-th>
                </template>

                <template slot-scope="{data}">
                    <tbody>
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].meta">
                                <vs-chip transparent color="primary" class="">
                                    <h6 class="text-primary cursor-pointer" @click="showMeta(tr)">{{data[indextr].meta}}</h6>
                                </vs-chip>
                            </vs-td>

                            <vs-td :key="indextr" v-for="(item, indextr) in data[indextr].responsables">

                                <div class="vx-col sm:w-3/4 w-full flex items-center sm:border border-0 d-theme-border-grey-light border-r-0 border-t-0 border-b-0">
                                    <div class="p-4 flex flex-col w-full">
                                        
                                        <div class="my-4">
                                            <p class="font-bold text-center">{{ item.nombres }} {{ item.apellidos }}</p>
                                            <small class="text-primary flex items-start justify-center mt-1">{{ item.numDocumento }}</small>
                                            <span class="text-grey flex items-start justify-center mt-1">
                                                <span class="text-sm">{{ item.cargo }}</span>
                                            </span>
                                        </div>

                                        <div class="flex flex-wrap-reverse items-center flex-grow justify-start">
                                            <div @click="verActividad(element)" :key="index" v-for="(element, index) in item.actividades" v-bind:class="[ statusColor(element.estado) , statusColorBorder(element.estado) , 'flex self-start border border-solid mr-1 mb-1 py-1 px-2 rounded cursor-pointer']">
                                                <span class="text-sm"></span>
                                                <feather-icon :icon="element.estado===1?'TruckIcon':'CheckCircleIcon'" svgClasses="h-4 w-4" />
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                                
                            </vs-td>
                        </vs-tr>
                    </tbody>
                </template>

            </vs-table>

            <div class="flex flex-wrap-reverse items-center flex-grow justify-end">
                <p class="truncate text-sm">
                    Mostrando registros del <strong>{{ currentPage * itemsPerPage - (itemsPerPage - 1) }}</strong> al <strong>{{ itemsMeta.length - currentPage * itemsPerPage > 0 ? currentPage * itemsPerPage : itemsMeta.length }}</strong> de un total de <strong>{{ itemsMeta.length }}</strong> registros
                </p>
            </div>

        </vx-card>

        <vs-popup :title="'Detalle de actividad diaria - ' + nombreReponsable" :active.sync="popupActividad" id="id-popup-actividad-list">
            <div class="items-grid-view vx-row match-height">
                <div class="vx-col lg:w-1/2 md:w-1/2 sm:w-1/2 w-full" v-for="item in itemsRegistro" :key="item.id">
                    <vx-card class="mb-base overflow-hidden" id="grid-view-meta-item">
                        <template slot="no-body">
                            <div class="item-img-container bg-white h-64 flex items-center justify-center mt-4 mb-4 cursor-pointer">
                                <img :src="'data:image/jpg;base64,' + item.imagen" class="grid-view-img px-4">
                            </div>
                            <div class="item-details px-4">
                                <div class="flex justify-between items-center">
                                    <div class="text-warning border border-solid border-warning flex py-1 px-2 rounded">
                                        <span class="text-sm mr-1">{{ item.actividad.meta }}</span>
                                    </div>
                                    <span class="font-bold text-primary text-sm">{{ item.fecha }}</span>
                                </div>
                                <div class="my-4">
                                    <div class="flex justify-between items-center">
                                        <h6 class="truncate font-semibold mb-1 hover:text-primary cursor-pointer">
                                            {{ item.descripcion }}
                                        </h6>
                                    </div>
                                    <p class="item-description truncate text-sm">{{ item.actividad.titulo }}</p>
                                </div>
                                <div class="my-4">
                                    <div class="flex justify-between items-center">
                                        <span class="font-medium text-success text-sm">Lat: {{ item.latitud }}</span>
                                        <span class="font-medium text-success text-sm">Long: {{ item.longitud }}</span>
                                    </div>
                                </div>
                            </div>
                            <slot name="action-buttons" />
                        </template>
                    </vx-card>
                </div>
            </div>

            <vx-card class="mb-base" no-shadow card-border>
                <maps-reponsable :markers="markers" :posicion="posicion" />
            </vx-card>
            
            <div class="vx-col w-full">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="popupActividad=false" icon-pack="feather" color="primary" icon="icon-thumbs-up" class="ml-auto mt-2">Aceptar</vs-button>
                </div>
            </div>

        </vs-popup>

        <vs-popup title="Meta detalle" :active.sync="popupDetalleMeta">
            <div class="vx-row">
                <div class="vx-col w-full md:w-1/3">
                    <span class="flex flex-wrap-reverse justify-end"><strong>META: </strong></span>
                </div>
                <div class="vx-col w-full md:w-2/3">
                    <span class=""> {{ detalleMeta === null ? '' : detalleMeta.meta }} </span>
                </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full md:w-1/3">
                    <span class="flex flex-wrap-reverse justify-end"><strong>COD. PROY/PROD.: </strong></span>
                </div>
                <div class="vx-col w-full md:w-2/3">
                    <div @click="accessSsi" class="cursor-pointer">
                        <vs-chip color="primary">
                            <vs-avatar color="primary" icon-pack="feather" icon="icon-link-2"/>
                            {{detalleMeta === null ? '' : detalleMeta.codigoProductoProyecto }}
                        </vs-chip>
                    </div>
                </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full md:w-1/3">
                    <span class="flex flex-wrap-reverse justify-end"><strong>PROYECTO/PRODUCTO: </strong></span>
                </div>
                <div class="vx-col w-full md:w-2/3">
                    <span class=""> {{ detalleMeta === null ? '' : detalleMeta.productoProyecto }} </span>
                </div>
            </div>

            <vs-divider/>
            <div class="vx-col w-full">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="popupDetalleMeta=false" icon-pack="feather" color="primary" icon="icon-thumbs-up" class="ml-auto mt-2">Aceptar</vs-button>
                </div>
            </div>
        </vs-popup>

    </div>
</template>
<script>
import GoogleMaps from './components/GoogleMaps.vue';
import MapsReponsable from './components/MapsReponsable.vue';
import Datepicker from 'vuejs-datepicker';
import {en, es} from 'vuejs-datepicker/src/locale';
export default {
    components: {
        GoogleMaps,
        MapsReponsable,
        Datepicker
    },

    data(){
        return {
            es: es,
            lengthHeader: 3,

            nombreReponsable: '',

            itemsMeta: [],
            itemsPerPage: 10,
            isMounted: false,

            popupActividad: false,
            itemsRegistro: [],

            markers: [],
            posicion: {},

            inputFecha: new Date(),
            disabledDatesInicio: {
                to: new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate()),
                from: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            },
            popupDetalleMeta: false,
            detalleMeta: null
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
        this.getMetas();
    },

    methods: {
        getMetas(){
            this.$vs.loading();
            this.$http.getMetasAndResidente()
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    this.itemsMeta = data;

                    data.forEach((item)=>{
                        if(item.responsables.length > this.lengthHeader){
                            this.lengthHeader = item.responsables.length;
                        }
                    });
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        showMeta(tr){
            this.$vs.loading();
            this.$http.searchMeta(tr.meta)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    this.detalleMeta = data;
                    this.popupDetalleMeta = true;
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        buscarPorFecha(){
            if(this.inputFecha === null){
                this.showMessageAlert('Seleccione la fecha para realizar la consulta.');
                return;
            }
            let dayFin = `${(this.inputFecha.getDate())}`.padStart(2,'0');
            let monthFin = `${(this.inputFecha.getMonth()+1)}`.padStart(2,'0');
            let yearFin = this.inputFecha.getFullYear();

            const fecha = `${ dayFin }-${ monthFin }-${ yearFin }`;

            this.$vs.loading();
            this.$http.getMetasAndResidenteByFecha(fecha)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    const data = response.data;
                    this.itemsMeta = data;

                    data.forEach((item)=>{
                        if(item.responsables.length > this.lengthHeader){
                            this.lengthHeader = item.responsables.length;
                        }
                    });
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        verActividad(item){
            this.nombreReponsable = item.usuario.nombres + ' ' + item.usuario.apellidos;
            this.getRegistrosPorActividad(item.id);
        },

        getRegistrosPorActividad(id){
            this.$vs.loading();
            this.$http.listarRegistrosPorActividad(id)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200 && response.data.success){
                    this.itemsRegistro = response.data.data;
                    if(this.itemsRegistro.length === 0){
                        this.$vs.dialog({
                            type: 'alert',
                            color: 'danger',
                            title: `Aviso`,
                            text: 'Sin registro de actividad.',
                            acceptText: 'Aceptar',
                        });
                        return;
                    } else {
                        this.markers = [];
                        this.itemsRegistro.forEach(registro => {
                            let latid = registro.latitud;
                            let longi = registro.longitud;
                   
                            if(latid !== null && longi !== null){
                                this.posicion = { lat: parseFloat(latid), lng: parseFloat(longi) };

                                let marker = {
                                    title: this.nombreReponsable,
                                    position: { lat: parseFloat(latid), lng: parseFloat(longi) },
                                    icon: require(`@/assets/images/person/persona1.png`),
                                    meta: null,
                                    cargo: null,
                                    ndocumento: null,
                                    abreviatura: null,
                                    oficina: null,
                                    fecha: registro.fecha
                                };
                                this.markers.push(marker);
                            }

                        });
                        this.popupActividad = true;
                    }
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        accessSsi(){
            if(this.detalleMeta === null){
                this.$vs.dialog({
                    type: 'alert',
                    color: 'danger',
                    title: `Aviso`,
                    text: 'Seleccione la meta.',
                    acceptText: 'Aceptar',
                });
                return;
            }
            window.open("https://ofi5.mef.gob.pe/repseguim/proyinv09.html?codigo=" + this.detalleMeta.codigoProductoProyecto, '_blank').focus();
        },

        statusColor(status) {
            if (status === 1) return 'text-warning'
            if (status === 2) return 'text-success'
            return 'text-primary'
        },

        statusColorBorder(status) {
            if (status === 1) return 'border-warning'
            if (status === 2) return 'border-success'
            return 'border-primary'
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
@import "@/assets/scss/vuexy/_variables.scss";
#id-popup-actividad-list {
    .vs-popup {
        width: 800px;
    }
    .vs-con-table {
        .vs-table--thead {
            th {
                background: #d9d8d8;
            }
        }
    }
}
#grid-view-meta-item {
    .grid-view-img {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        transition: .35s;
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0px 4px 25px 0px rgba(0,0,0,.25);

        .grid-view-img{
            opacity: 0.9;
        }
    }
}

#data-metas-list-view {
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

#item-detail-page {
  .color-radio {
    height: 2.28rem;
    width: 2.28rem;

    > div {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .item-features {
    background-color: #f7f7f7;

    .theme-dark & {
      background-color: $theme-dark-secondary-bg;
    }
  }

  .product-sales-meta-list {
    .vs-list--icon {
      padding-left: 0;
    }
  }

  .related-product-swiper {
      // padding-right: 2rem;
      // padding-left: 2rem;

    .swiper-wrapper {
      padding-bottom: 2rem;

      > .swiper-slide {
        background-color: #f7f7f7;
        box-shadow: 0 4px 18px 0 rgba(0,0,0,0.1), 0 5px 12px 0 rgba(0,0,0,0.08) !important;

        .theme-dark & {
          background-color: $theme-light-dark-bg;
        }
      }
    }

    .swiper-button-next,
    .swiper-button-prev {
      transform: scale(.5);
      filter: hue-rotate(40deg);
    }

    .swiper-button-next {
      right: 0
    }

    .swiper-button-prev {
      left: 0;
    }
  }
}
</style>