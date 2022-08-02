<template>
    <div id="item-detail-page">
        <vx-card v-if="item_data" :key="item_data.objectID">
            <template slot="no-body">
                <div class="item-content">

                    <div class="product-details p-6">
                        <div class="vx-row mt-6">

                            <div class="vx-col md:w-2/5 w-full flex items-center justify-center">
                                <div class="product-img-container w-3/5 mx-auto mb-10 md:mb-4">
                                    <img :src="'data:image/jpg;base64,' + item_data.imagen" class="responsive">
                                </div>
                            </div>

                            <div class="vx-col md:w-3/5 w-full">
                                <h3>{{ item_data.descripcion }}</h3>
                                <p class="my-2">
                                    <span>{{ item_data.actividad.descripcion }}</span>
                                </p>

                                <vs-divider color="danger" />

                                <p class="flex items-center flex-wrap">
                                    <span class="pl-4 mr-2 mt-2 border border-solid d-theme-border-grey-light border-t-0 border-b-0 border-r-0 font-bold">{{ item_data.actividad.titulo }}</span>
                                </p>

                                <vs-divider color="danger" />

                                <p>Sec. Func/Meta - {{ item_data.actividad.meta }}</p>

                                <vs-list class="product-sales-meta-list px-0 pt-4">
                                    <vs-list-item
                                    class="p-0 border-none"
                                    title="Estado"
                                    icon-pack="feather"
                                    icon="icon-check" />
                                    <vs-chip color="warning" v-if="item_data.actividad.estado===1">
                                    En ejecucíon
                                    </vs-chip>
                                    <vs-chip color="success" v-if="item_data.actividad.estado===2">
                                    Terminado
                                    </vs-chip>
                                </vs-list>

                                <vs-divider />

                                <div class="vx-row">
                                    <div class="vx-col w-full">
                                        <h6>Longitud:  {{item_data.longitud}}</h6>
                                        <h6>Latitud : {{item_data.latitud}}</h6>
                                        <p class="my-2">
                                            <span>Fecha de modificación</span>
                                            <span class="mx-2">-</span>
                                            <span class="text-success">{{ item_data.fecha }}</span>
                                        </p>
                                    </div>
                                    <div class="vx-col w-full">
                                        <div class="flex flex-wrap items-start mb-4">
                                            <vs-button  class="mr-4 mb-4" icon-pack="feather" icon="icon-corner-up-left" @click="regresar">Regresar</vs-button>
                                        </div>
                                    </div>
                                </div>
                                        
                            </div>

                        </div>
                    </div>
                </div>
            </template>
        </vx-card>
    </div>
</template>
<script>
import 'swiper/dist/css/swiper.min.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import StarRating from 'vue-star-rating'
export default {
    components: {
        swiper,
        swiperSlide,
        StarRating
    },

    data(){
        return {
        item_data: null
        }
    },

    created() {
        this.parametro = this.$route.params.id;
        if(this.parametro !== '0'){
            this.showRegistro(this.parametro);
        } else {
            this.item_data = null;
        }
	},

    methods: {
        showRegistro(id){
            this.$vs.loading();
            this.$http.getRegistro(id)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200 && response.data.success){
                    this.item_data = response.data.data[0];
                }
            }).catch(error => {
                this.$vs.loading.close();
            });
        },

        regresar(){
            this.$router.push({name: 'actividad-metas-residente', params: {meta: 'all' }}).catch(() => {})
        }
    }
}
</script>
<style lang="scss">

@import "@/assets/scss/vuexy/_variables.scss";

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