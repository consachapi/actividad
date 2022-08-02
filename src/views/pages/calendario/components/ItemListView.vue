<template>
    <vx-card class="list-view-item overflow-hidden" v-on="$listeners">
        <template slot="no-body">
            <div class="vx-row item-details no-gutter">
    <!--
                <div class="vx-col sm:w-1/4 w-full item-img-container bg-white flex items-center justify-center cursor-pointer" @click="showRegisters(item.id)">
                    <img :src="require('@/assets/images/pages/proyecto.png')" class="grid-view-img p-4">
                </div>
    -->
                <div class="vx-col sm:w-2/3">
                    <div class="p-4 pt-6">
                        <slot name="item-meta">
                            <h6 class="item-name font-semibold mb-1 hover:text-primary cursor-pointer" @click="showRegisters(item.id)">{{ item.name }}</h6>
                        </slot>
                    </div>
                </div>

                <div class="vx-col sm:w-1/3 w-full flex items-center sm:border border-0 border-solid d-theme-border-grey-light border-r-0 border-t-0 border-b-0">
                    <div class="p-4 flex flex-col w-full">
                        <div class="text-warning flex self-end border border-solid border-warning py-1 px-2 rounded">
                            <span class="text-sm mr-1"></span>
                            <feather-icon icon="CheckIcon" svgClasses="h-4 w-4" />
                        </div>
                        <div class="my-2">
                            <h5 class="font-bold text-center">{{ item.meta }}</h5>
                            <span class="text-grey flex items-start justify-center mt-1">
                                <feather-icon icon="LayersIcon" svgClasses="w-4 h-4" />
                                <span class="text-sm ml-2">Sec. Func/Meta</span>
                            </span>
                        </div>
                        <slot name="action-buttons" />
                    </div>
                </div>
                
            </div>
        </template>
    </vx-card>
</template>
<script>
export default{
    props: {
        item: {
        type: Object,
        required: true
        }
    },
    computed: {
    
    },
    methods: {
        showRegisters(id){
            this.$router.push({name: 'registro-listar', params: {id: id }}).catch(() => {});
        }
    }
}
</script>

<style lang="scss" scoped>
.list-view-item {
    .item-name, .item-description {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .item-name {
        -webkit-line-clamp: 2;
    }

    .item-description {
        -webkit-line-clamp: 5;
    }

    .grid-view-img {
        max-width: 10%;
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
</style>
