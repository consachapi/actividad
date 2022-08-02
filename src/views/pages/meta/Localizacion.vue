<template>
    <div>
        <vx-card class="mb-base" no-shadow card-border>
            <h2 style="text-align: center;">Ubicación por Meta</h2>

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

            <div class="vx-col w-full mb-4">
                <label class="text-sm opacity-100 font-bold">Meta</label>
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

            <google-maps :markers="markers" />
        </vx-card>

        <vs-prompt
        @accept="acceptAlert"
        @close="cancelAlert"
        title="Aviso"
        acceptText='Aceptar'
        cancel=""
        :active.sync="activePrompt">
            <div>
                Enter your first and last name to <b>continue</b>.
            </div>
        </vs-prompt>

    </div>
</template>
<script>
import GoogleMaps from './components/GoogleMaps.vue';
import vSelect from 'vue-select';
import Datepicker from 'vuejs-datepicker';
import {en, es} from 'vuejs-datepicker/src/locale';
export default {
    components: {
        GoogleMaps,
        vSelect,
        Datepicker
    },

    data(){
        return {
            es: es,
            itemsMeta: [],
            metaSelected: { value: '', label: 'Todos' },

            markers: [],
            personas: [
                "@/assets/images/person/persona1.png",
                "@/assets/images/person/persona2.png",
                "@/assets/images/person/persona3.png",
                "@/assets/images/person/persona4.png",
                "@/assets/images/person/persona5.png",
                "@/assets/images/person/persona6.png",
                "@/assets/images/person/persona7.png",
                "@/assets/images/person/persona8.png"
            ],

            inputFecha: new Date(),
            disabledDatesInicio: {
                to: new Date(new Date().getFullYear(), new Date().getMonth() - 2, new Date().getDate()),
                from: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
            },


            activePrompt: false,
        }
    },

    created(){
        this.getMeta();
    },

    mounted(){
        this.getLocatizacion(this.metaSelected, this.inputFecha);
    },

    watch:{
        metaSelected(val){
            if(val !== null){
                this.getLocatizacion(val, this.inputFecha);
            }
        }
    },

    methods: {
        getMeta(){
            this.$vs.loading();
            this.$http.getMetasSelection()
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.itemsMeta = response.data;
                    this.itemsMeta.unshift({value: '', label: 'Todos'});
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getLocatizacion(meta, fecha){
            let dayFin = `${(fecha.getDate())}`.padStart(2,'0');
            let monthFin = `${(fecha.getMonth()+1)}`.padStart(2,'0');
            let yearFin = fecha.getFullYear();

            const fechaConsulta = `${ dayFin }-${ monthFin }-${ yearFin }`;
            
            if(meta === null){
                this.$vs.dialog({
                    type: 'alert',
                    color: 'danger',
                    title: `Aviso`,
                    text: 'Seleccione el número de meta.',
                    acceptText: 'Aceptar',
                });
                return;
            }
       
            this.$vs.loading();
            this.$http.getLocalizationByMetaAndDate(meta.value, fechaConsulta)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200){
                    this.markers = [];
                    const data = response.data;

                    data.forEach(item => {
                        let responsables = item.responsables;
                        let k = 1;
                        responsables.forEach(responsable => {
                            let lat = null;
                            let lng = null;
                            
                            const residente = responsable.nombres + ' ' + responsable.apellidos;
                            const numMeta = item.meta;
                            const cargo = responsable.cargo;
                            const dni = responsable.numDocumento;
                            const abreviatura = responsable.oficina.abreviatura;
                            const oficina = responsable.oficina.descripcion;
                            let fechaRegistro = "";

                            let actividades = responsable.actividades;
                            actividades.forEach(actividad => {
                                let registros = actividad.registroActividads;

                                registros.forEach(registro => {
                                    let latid = registro.latitud;
                                    let longi = registro.longitud;
                                    fechaRegistro = registro.fechaRegistro;
                                    if(latid !== null && longi !== null){
                                        lat = parseFloat(latid);
                                        lng = parseFloat(longi);
                                    }
                                });

                            });
                            if(k === 8){k=1}

                            if(lat !== null && lng !== null){
                                let marker = {
                                    title: residente,
                                    position: { lat: lat, lng: lng },
                                    icon: require(`@/assets/images/person/persona${ k }.png`),
                                    meta: numMeta,
                                    cargo: cargo,
                                    ndocumento: dni,
                                    abreviatura: abreviatura,
                                    oficina: oficina,
                                    fecha: fechaRegistro
                                };
                                k++;
                                this.markers.push(marker);
                            }

                        });
                    });
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        buscarPorFecha(){
            this.getLocatizacion(this.metaSelected, this.inputFecha);
        },

        acceptAlert(){
            this.$vs.notify({
                color:'success',
                title:'Accept Selected',
                text:'Lorem ipsum dolor sit amet, consectetur'
            })
        },
        cancelAlert(){
            this.$vs.notify({
                color:'danger',
                title:'Closed',
                text:'You close a dialog!'
            })
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

</style>