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
    </div>
</template>
<script>
const ItemListView = () => import('./ItemListView.vue')
export default {
    components: {
        ItemListView,
    },
    created() {
		this.parametro = this.$route.params.id;
		if(this.parametro !== 'all'){
            this.getActividadesPorMeta(this.parametro);
        } else {
            this.getActividadesTodo();
        }
	},
    data(){
        return {
            cartItems: [],
        }
    },
    computed: {
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
            this.$router.push({name: 'registro-listar', params: {id: id }}).catch(() => {});
        }
    }
}
</script>
