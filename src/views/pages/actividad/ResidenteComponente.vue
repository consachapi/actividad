<template>
    <div class="chat__contact flex items-center px-2 pt-4 pb-2" :class="{'bg-primary-gradient text-white shadow-lg': isActiveResidenteUser}">
        <div class="contact__avatar mr-1">
            <vs-avatar class="border-2 border-solid border-white" :src="residente.photoURL" size="42px" />
        </div>
        <div class="contact__container w-full flex items-center justify-between overflow-hidden">
            <div class="contact__info flex flex-col truncate w-5/6">
                <h5 class="font-semibold text-sm" :class="{'text-white': isActiveResidenteUser}">{{residente.displarName}}</h5>
                <span class="truncate">{{ residente.oficina.abreviatura}}</span>
                <small class="truncate text-primary font-medium text-sm" :class="{'text-white': isActiveResidenteUser}">{{ residente.cargo }}</small>
            </div>
            <div class="chat__contact__meta flex self-start flex-col items-end w-1/6">
                <span class="whitespace-no-wrap">{{lastMessaged}}</span>
                <vs-chip class="number" color="success" :class="{'bg-white text-black': isActiveResidenteUser}">{{residente.numMetas}}</vs-chip>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        residente: { type: Object,  required: true },
        isActiveResidenteUser: { type: Boolean },
        lastMessaged: { type: String,  default : '' },
    }
}
</script>
<style lang="scss">
@import "@/assets/scss/vuexy/apps/chat.scss";
</style>