<template>
    <div>
        <vx-card
            title=""
            title-color="#fff"
            card-background="linear-gradient(90deg, rgba(94,23,11,1) 0%, rgba(212,1,1,1) 38%, rgba(223,50,17,1) 68%)"
            content-color="#fff"
            class="mb-4">
            <div class="vx-row">
                <div class="vx-col sm:w-3/4 w-full">
                    <h3 class="mt-4 text-white"><strong>MiPROYECTO</strong></h3>
                    <h3 class="mb-3 mt-1 text-white"><strong>Sistema de Control y Monitoreo Actividades Diarias</strong></h3>
                </div>
                <div class="vx-col sm:w-1/4 w-full">
                    <div class="text-white flex flex-col justify-start items-end">
                        <img src="@/assets/images/pages/gore.png" width="120" height="50" class="mt-4">
                    </div>
                </div>
            </div>
        </vx-card>

        <vx-card class="overlay-card overflow-hidden">
            <template slot="no-body">
                <img src="@/assets/images/pages/banner.png" alt="user-profile-cover" class="responsive">
            </template>
        </vx-card>

    </div>
</template>
<script>
import VueApexCharts from 'vue-apexcharts';
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'

export default {
    components: {
        VueApexCharts,
        StatisticsCardLine
    },
}
</script>
<style lang="scss">
@import "@/assets/scss/vuexy/pages/profile.scss";
</style>