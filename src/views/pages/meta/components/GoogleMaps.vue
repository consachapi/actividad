<template>
    <gmap-map
        :center="center"
        :zoom="20"
        style="width: 100%; height: 650px"
    >
        <gmap-marker
        :key="index" v-for="(m, index) in markers"
        :position="m.position"
        :icon="m.icon"
        :title="m.title + '\nMeta: ' + m.meta + '\nOficina: ' + m.abreviatura"
        :clickable="true"
        :draggable="false"
        
        @click="openInfoWindowTemplate(index)"
        >
        </gmap-marker>
        <gmap-info-window
            :options="{
            maxWidth: 300,
            pixelOffset: { width: 0, height: -35 }
            }"
            :position="infoWindow.position"
            :opened="infoWindow.open"
            @closeclick="infoWindow.open=false">
            <div v-html="infoWindow.template"></div>
        </gmap-info-window>
    </gmap-map>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    components: {
        mapGetters
    },

    data () {
      return {
        center: { lat: -13.5240684, lng: -71.9630701 },

        infoWindow: {
          position: {lat: 0, lng: 0},
          open: false,
          template: ''
        }
      }
    },

    props: {
        markers: Array
    },

    computed: {

    },

    methods: {
        openInfoWindowTemplate(index) {
            let data = this.markers[index]
            this.infoWindow.position = { lat: data.position.lat, lng: data.position.lng }
            this.infoWindow.template = `<h6>${data.title}</h6><strong class="text-primary flex flex-wrap items-center justify-center">${data.ndocumento}</strong>
            <label class="text-sm opacity-100 font-bold text-primary flex flex-wrap items-center justify-center">
                META: ${ data.meta }
            </label>
            <br>
            <label class="text-sm opacity-100 font-bold">
                ${ data.oficina }
            </label>
            <br>
            <label class="text-sm opacity-75 font-medium">
                ${ data.cargo }
            </label>
            <br>
            <small class="text-success"> Registrado el día ${ data.fecha }</small>
            `
            this.infoWindow.open = true
        },
    }
}
</script>
