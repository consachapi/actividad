<template>
    <gmap-map
        :center="posicion"
        :zoom="17"
        style="width: 100%; height: 300px"
    >
        <gmap-marker
        :key="index" v-for="(m, index) in markers"
        :position="m.position"
        :icon="m.icon"
        :title="m.title"
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
        infoWindow: {
          position: {lat: 0, lng: 0},
          open: false,
          template: ''
        }
      }
    },

    props: {
        markers: Array,
        posicion: Object
    },

    computed: {

    },

    methods: {
        openInfoWindowTemplate(index) {
            let data = this.markers[index]
            this.infoWindow.position = { lat: data.position.lat, lng: data.position.lng }
            this.infoWindow.template = `<h6>${data.title}</h6>
            <br>
            <small class="text-success"> Registrado el día ${ data.fecha }</small>
            `
            this.infoWindow.open = true
        },
    }
}
</script>
