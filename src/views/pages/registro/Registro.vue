<template>
    <div id="ecommerce-wishlist-demo">
        <div class="items-grid-view vx-row match-height" v-if="wishListitems.length" appear>
            <div class="vx-col lg:w-1/4 md:w-1/3 sm:w-1/2 w-full" v-for="item in wishListitems" :key="item.objectID">
                <item-grid-view :item="item">
                    <template slot="action-buttons">
                        <div class="flex flex-wrap">
                            <div
                                class="item-view-secondary-action-btn bg-primary p-3 flex flex-grow items-center justify-center text-white cursor-pointer"
                                @click="navigate_to_detail_view(item.id)">
                                <feather-icon icon="ShoppingBagIcon" svgClasses="h-4 w-4" />
                                <span class="text-sm font-semibold ml-2">Ver</span>
                            </div>
                        </div>
                    </template>
                </item-grid-view>
            </div>
        </div>
    </div>
</template>
<script>
const ItemGridView = () => import('./ItemGridView.vue')
export default {
    components: {
        ItemGridView
    },
    data(){
        return {
            wishListitems: []
        }
    },

    created() {
		this.parametro = this.$route.params.id;
		if(this.parametro !== 'all'){
            this.getRegistrosPorActividad(this.parametro);
        } else {
            this.getRegistrosTodo();
        }
	},

    methods: {
        getRegistrosPorActividad(id){
            this.$vs.loading();
            this.$http.listarRegistrosPorActividad(id)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200 && response.data.success){
                    this.wishListitems = response.data.data;
                }
            }).catch(error => {
                this.$vs.loading.close();
            });
        },

        getRegistrosTodo(){
            this.$vs.loading();
            this.$http.listarRegistrosTodo()
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200 && response.data.success){
                    this.wishListitems = response.data.data;
                }
            }).catch(error => {
                this.$vs.loading.close();
            });
        },

        navigate_to_detail_view(id) {
            this.$router.push({name: 'registro-listar-detalle', params: {id: id }}).catch(() => {})
        }
    }
}
</script>
<style lang="scss" scoped>
#ecommerce-wishlist-demo {
    .item-view-primary-action-btn {
        color: #2c2c2c !important;
        background-color: #f6f6f6;
        min-width: 50%;
    }

    .item-view-secondary-action-btn {
        min-width: 50%;
    }
}
</style>