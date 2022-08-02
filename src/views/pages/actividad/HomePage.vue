<template>
    <div id="activ-app" class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden">
        <vs-sidebar class="items-no-padding" v-model="isChatSidebarActive" :click-not-close="clickNotClose" :hidden-background="clickNotClose" id="chat-list-sidebar">
          
            <div class="chat__profile-search flex p-4">
                <div class="relative inline-flex">
                    <vs-avatar class="m-0 border-2 border-solid border-white" :src="activeUserInfo.photoURL" size="40px" />
                    <div class="h-3 w-3 border-white border border-solid rounded-full absolute right-0 bottom-0 bg-success"></div>
                </div>
                <vs-input icon-no-border icon="icon-search" icon-pack="feather" class="w-full mx-5 input-rounded-full" placeholder="Buscar" v-model="searchQuery"/>
                <feather-icon class="md:inline-flex lg:hidden -ml-3 cursor-pointer" icon="XIcon" />
            </div>

            <vs-divider class="d-theme-border-grey-light m-0" />

            <component :is="scrollbarTag" class="chat-scroll-area pt-4">
                <div class="chat__chats-list mb-8">
                    <h3 class="text-primary mb-5 px-4">Residentes</h3>
                    <ul class="chat__active-chats bordered-items">
                        <li class="cursor-pointer" v-for="(residente, index) in residentes" :key="index" @click="updateActiveResidents(residente.id, residente.numDocumento)">
                            <residente-component :residente="residente" :isActiveResidenteUser="isActiveResidenteUser(residente.id)"></residente-component>
                        </li>
                    </ul>
                </div>
            </component>
        </vs-sidebar>
        
        <div class="sidebar-spacer no-scroll-content border border-solid d-theme-border-grey-light border-r-0 border-t-0 border-b-0">

            <div class="flex border d-theme-dark-bg items-center">
                <feather-icon class="md:inline-flex lg:hidden ml-4 mr-4 cursor-pointer" icon="MenuIcon"/>
                <vs-input icon-no-border icon="icon-search" size="large" icon-pack="feather" placeholder="Buscar meta" v-model="searchQuery" class="vs-input-no-border vs-input-no-shdow-focus w-full" />
            </div>

            <component :is="scrollbarTag" class="email-content-scroll-area" :settings="settings">
                <transition-group name="list-enter-up" class="email__mails" tag="ul" appear>
                <li class="cursor-pointer email__mail-item" v-for="(meta, index) in metas" :key="index">
                    <div class="mail__mail-item sm:px-4 px-2 py-6" @click="verActividades(meta.numero)">
                    <div class="flex w-full">
                        <vs-avatar class="sender__avatar flex-shrink-0 mr-3 border-2 border-solid border-white" :src="imageDefault" size="40px"></vs-avatar>
                        <div class="flex w-full justify-between items-start">
                        <div class="mail__details">
                            <h5 class="mb-1 font-semibold" >Meta: {{meta.numero}}</h5>
                            <span>Programa: {{ meta.programa }}</span>
                        </div>
                        <div class="mail-item__meta flex items-center">
                            <div class="email__labels hidden sm:flex items-center">
                                <div class="h-2 w-2 rounded-full mr-2"></div>
                                <span>{{ meta.proyecto}}</span>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div class="flex w-full">
                        <div class="mail__message ml-3">
                            <span>{{ meta.descripcion}}</span>
                        </div>
                    </div>
                    </div>
                </li>
                </transition-group>
            </component>
        </div>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import ResidenteComponent from './ResidenteComponente.vue';

export default {
    components: {
        VuePerfectScrollbar,
        ResidenteComponent,
    },
    data () {
        return {
            clickNotClose: true,
            isChatSidebarActive  : true,
            isLoggedInUser: true,
            searchQuery:'',

            activeMetasResidente: null,
            imageDefault: require("@/assets/images/portrait/other/settings-64.png"),
            residentes: [],
            metas: [],
            settings: {
                maxScrollbarLength : 60,
                wheelSpeed: 0.30
            }
        }
    },
    created(){
        
    },
    computed: {
        activeUserInfo() {
            return this.$store.state.AppActiveUser
        },
        scrollbarTag () {
            return this.$store.getters.scrollbarTag
        },
        isActiveResidenteUser(){
            return (userId) => userId === this.activeMetasResidente
        }
    },
    created(){},
    mounted(){
        this.listarResidentes();
    },
    methods: {
        updateActiveResidents(id, numDocumento){
            this.activeMetasResidente = id;
            this.listarMetasPorResidente(numDocumento);
        },

        listarResidentes(){
            this.$vs.loading();
            this.$http.listarResidentesActivos()
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200 && response.data.success){
                    const data = response.data.data;
                    data.forEach((element, index) => {
                        let item = {
                            id: index + 1,
                            photoURL: require("@/assets/images/pages/person.png"),
                            displarName: `${ element.nombres } ${ element.apellidos }`,
                            cargo: element.cargo.descripcion,
                            oficina: element.oficina,
                            numMetas: '',
                            numDocumento: element.numDocumento
                        };
                        this.residentes.push(item);
                    });
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.showNotify(error.response.status, error.response.data.message);
            });
        },

        listarMetasPorResidente(numDocumento){
            this.$vs.loading();
            this.$http.metadPorResidente(numDocumento)
            .then(response => {
                if(response.status === 200 && response.data.success){
                    this.metas = response.data.data;
                }
                this.$vs.loading.close();
            }).catch(error => {
                this.$vs.loading.close();
                this.showNotify(error.response.status, error.response.data.message);
            });
        },

        verActividades(numMeta){
            this.$router.push({name: 'calendario-meta', params: {meta: numMeta }}).catch(() => {})
        },

        showNotify(status, message){
            if(status === 400){
                this.$vs.notify({
                    title: 'Aviso',
                    text: message,
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }

            if(status === 401){
                this.$vs.notify({
                    title: 'Aviso',
                    text: 'No autorizado',
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }

            if(status === 403){
                this.$vs.notify({
                    title: 'Aviso',
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
                    color: 'danger'
                });
            }
        },
  }
}

</script>


<style lang="scss">
@import "./style.scss";
</style>
