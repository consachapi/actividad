<template>
    <vs-tabs :position="isSmallerScreen ? 'top' : 'left'" class="tabs-shadow-none" id="profile-tabs" :key="isSmallerScreen">
        <vs-tab icon-pack="feather" icon="icon-user" :label="!isSmallerScreen ? 'Crear Usuario' : ''">
            <div class="tab-change-pwd md:ml-4 md:mt-0 mt-4 ml-0">
                <crear-usuario />
            </div>
        </vs-tab>
        <vs-tab icon-pack="feather" icon="icon-lock" :label="!isSmallerScreen ? 'Resetear Contraseña' : ''">
            <div class="tab-info md:ml-4 md:mt-0 mt-4 ml-0">
                <reset-password />
            </div>
        </vs-tab>
    </vs-tabs>
</template>
<script>
import CrearUsuario from './CrearUsuario.vue';
import ResetPassword from './ResetPassword.vue';
export default {
    components: {
        CrearUsuario,
        ResetPassword
    },

    data(){
        return {

        }
    },
    computed: {
        isSmallerScreen () {
            return this.$store.state.windowWidth < 768;
        }
    }
}
</script>