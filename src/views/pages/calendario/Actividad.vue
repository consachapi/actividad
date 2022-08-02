<template>
    <div id="ecommerce-checkout-demo">
        <div class="vx-row">
            <div class="vx-col lg:w-full relative vx-row match-heigh">
                <div class="items-list-view vx-col lg:w-1/2 sm:w-1/2 w-full" v-for="(item) in cartItems" :key="item.id">
                    <item-list-view :item="item" class="mb-4">
                        <template slot="item-meta">
                            <p class="text-sm mb-2">ACTIVIDAD: <span class="font-semibold cursor-pointer"> {{ item.titulo }}</span></p>
                            <h6 class="mb-1 cursor-pointer hover:text-primary" @click="showRegisters(item.id)">
                                Detalle:    <strong class="font-bold"> {{ item.descripcion }}</strong>
                            </h6>
                            <p class="mt-2 text-sm">Creado el día<strong class="font-bold"> {{ item.fecha }}</strong></p>

                            <vs-divider />

                            <div class="vx-row">
                                <div class="vx-col w-full mt-2">
                                    <vs-chip color="warning" v-if="item.estado===1">
                                        En ejecucíon
                                    </vs-chip>
                                    <vs-chip color="success" v-if="item.estado===2">
                                        Terminado
                                    </vs-chip>
                                </div>
                            </div>

                            <p class="font-medium text-grey text-sm mt-2">{{ item.residente.perfil.descripcion }}</p>
                            <p class="text-success font-medium">{{ item.residente.nombres }} {{ item.residente.apellidos }}</p>
                        </template>
                        <template slot="action-buttons">
                            <div class="item-view-primary-action-btn p-3 rounded-lg flex flex-grow items-center justify-center cursor-pointer mb-2">
                                <feather-icon icon="TabletIcon" svgClasses="h-4 w-4" />
                                <span class="text-sm font-semibold ml-2">{{ item.residente.oficina.descripcion }}</span>
                            </div>
                            <div 
                            class="item-view-secondary-action-btn bg-primary p-3 rounded-lg flex flex-grow items-center justify-center text-white cursor-pointer"
                                @click="showRegisters(item.id)"
                            >
                                <feather-icon icon="EyeIcon" svgClasses="text-white fill-current h-4 w-4" />
                                <span class="text-sm font-semibold ml-2">Ver</span>
                            </div>
                        </template>
                    </item-list-view>
                </div>
            </div>
        </div>

        <vs-popup title="Detalle de la actividad diaria" :active.sync="popupActividad" id="id-popup-actividad-list">
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
                                    <h6 class="truncate font-semibold mb-1 hover:text-primary cursor-pointer">
                                        {{ item.descripcion }}
                                    </h6>
                                    <p class="item-description truncate text-sm">{{ item.actividad.titulo }}</p>
                                </div>
                            </div>
                            <slot name="action-buttons" />
                        </template>
                    </vx-card>
                </div>
            </div>
            
            <div class="vx-col w-full">
                <div class="flex flex-wrap items-center justify-end">
                    <vs-button @click="popupActividad=false" icon-pack="feather" color="primary" icon="icon-thumbs-up" class="ml-auto mt-2">Ok</vs-button>
                </div>
            </div>
        </vs-popup>

    </div>
</template>
<script>
const ItemListView = () => import('./components/ItemListView.vue');
export default {
    components: {
        ItemListView,
    },

    data(){
        return {
            cartItems: [],

            popupActividad: false,
            itemsRegistro: [],
        }
    },

    created() {
		this.parametro = this.$route.params.id;
		if(this.parametro !== 'all'){
            this.getActividadesPorMeta(this.parametro);
        } else {
            this.getActividadesTodo();
        }
	},

    methods: {
        getActividadesPorMeta(id){
            this.$vs.loading();
            this.$http.listarActividadesPorMeta(id)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200 && response.data.success){
                    this.cartItems = response.data.data;
                }
            }).catch(error => {
                this.cartItems = [];
                this.$vs.loading.close();
                this.$router.push({ path: '/calendario/listar'});
            });
        },

        getActividadesTodo(){
            this.$vs.loading();
            this.$http.listarTodoActividades()
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200 && response.data.success){
                    this.cartItems = response.data.data;
                }
            }).catch(error => {
                this.cartItems = [];
                this.$vs.loading.close();
            });
        },

        showRegisters(id){
            this.getRegistrosPorActividad(id);
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
                        this.popupActividad = true;
                    }
                }
            }).catch(error => {
                this.$vs.loading.close();
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
