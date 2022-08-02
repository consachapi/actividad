<template>
            <vx-card class="grid-view-item mb-base overflow-hidden" v-on="$listeners">
                <template slot="no-body">
                    <div class="item-img-container bg-white h-64 flex items-center justify-center mt-4 mb-4 cursor-pointer" @click="navigate_to_detail_view(item.id)">
                        <img :src="'data:image/jpg;base64,' + item.imagen" class="grid-view-img px-4">
                    </div>
                    <div class="item-details px-4">
                        <div class="flex justify-between items-center">
                            <div class="text-warning border border-solid border-warning flex py-1 px-2 rounded">
                                <span class="text-sm mr-1">{{ item.actividad.meta }}</span>
                                <feather-icon icon="StarIcon" svgClasses="h-4 w-4" />
                            </div>
                            <span class="font-bold text-sm">{{ item.fecha }}</span>
                        </div>
                        <div class="my-4">
                            <h6 class="truncate font-semibold mb-1 hover:text-primary cursor-pointer" @click="navigate_to_detail_view(item.id)">
                                {{ item.descripcion }}
                            </h6>
                            <p class="item-description truncate text-sm">{{ item.actividad.titulo }}</p>
                        </div>
                    </div>
                    <slot name="action-buttons" />
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
  methods: {
    navigate_to_detail_view (id) {
       this.$router.push({name: 'registro-listar-detalle', params: {id: id }}).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.grid-view-item {
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
</style>
