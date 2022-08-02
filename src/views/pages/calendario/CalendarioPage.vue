<template>
    <div id="simple-calendar-app">
        <div class="vx-card no-scroll-content">
            <calendar-view
                ref="calendar"
                :displayPeriodUom="calendarView"
                :show-date="showDate"
                :events="simpleCalendarEvents"
                :eventTop="windowWidth <= 400 ? '2rem' : '3rem'"
                eventBorderHeight="1px"
                eventContentHeight="1.65rem"
                class="theme-default"
                @click-date="openAddNewEvent"
                @click-event="openEditEvent"
            >
                <div slot="header" class="mb-4">
                    <div class="vx-row no-gutter">
                        <div class="vx-col sm:w-1/2 w-full flex justify-start">
                            <template v-for="(view, index) in calendarViewTypes">
                                
                                <vs-button
                                v-if="calendarView === view.val"
                                :key="String(view.val) + 'filled'"
                                type="filled"
                                class="p-3 md:px-8 md:py-3"
                                :class="{'border-l-0 rounded-l-none': index, 'rounded-r-none': calendarViewTypes.length !== index + 1}"
                                @click="calendarView = view.val">
                                    {{ view.label }}
                                </vs-button>
                                <vs-button
                                v-else
                                :key="String(view.val) + 'border'"
                                type="border"
                                class="p-3 md:px-8 md:py-3"
                                :class="{'border-l-0 rounded-l-none': index, 'rounded-r-none': calendarViewTypes.length !== index + 1}"
                                @click="calendarView = view.val">
                                    {{ view.label }}
                                </vs-button>
                                                           
                            </template>
                        </div>     
                        <div class="vx-col sm:w-1/2 w-full sm:my-0 my-3 flex sm:justify-end justify-ri order-last">
                            <div class="flex items-center">
                                <feather-icon
                                :icon="$vs.rtl ? 'ChevronRightIcon' : 'ChevronLeftIcon'"
                                @click="updateMonth(-1)"
                                svgClasses="w-5 h-5 m-1"
                                class="cursor-pointer bg-primary text-white rounded-full" />

                                <span class="mx-3 text-xl font-medium whitespace-no-wrap">{{ showDate.toLocaleString('pe-ES', { month: 'long' }) }} {{ showDate.getFullYear() }}</span>

                                <feather-icon
                                :icon="$vs.rtl ? 'ChevronLeftIcon' : 'ChevronRightIcon'"
                                @click="updateMonth(1)"
                                svgClasses="w-5 h-5 m-1"
                                class="cursor-pointer bg-primary text-white rounded-full" />
                            </div>
                        </div>
                    </div>

                    <div class="vx-row sm:flex hidden mt-4">
                        <div class="vx-col w-full flex">
                            <div class="flex flex-wrap sm:justify-start justify-center">
                                <div v-for="(label, index) in calendarLabels" :key="index" class="flex items-center mr-4 mb-2">
                                    <div class="h-3 w-3 inline-block rounded-full mr-2" :class="'bg-' + label.color"></div>
                                    <span>{{ label.text }}</span>
                                </div>
                                <div class="flex items-center mr-4 mb-2">
                                    <div class="h-3 w-3 inline-block rounded-full mr-2 bg-primary"></div>
                                    <span>Todos</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </calendar-view>
        </div>
    </div>
</template>
<script>
import { CalendarView, CalendarViewHeader } from 'vue-simple-calendar';
require('vue-simple-calendar/static/css/default.css')
import Datepicker from 'vuejs-datepicker';

export default {
    components: {
        CalendarView,
        CalendarViewHeader,
        Datepicker
    },

    data() {
        return {
            showDate: new Date(),
            calendarView: 'month',
            eventLabels: [],
            events: [],

            calendarViewTypes: [
                {
                    label: 'Mes',
                    val: 'month'
                },
                {
                    label: 'Semana',
                    val: 'week'
                }, 
            ],
            colorLabel: ['event-success', 'event-warning', 'event-danger', 'event-primary']
        }
    },

    created () {
        this.getEventosTodos();
        //this.getEventosPorMeta(this.parametro);
    },

    computed: {
        simpleCalendarEvents () {
            return this.events;
        },
        calendarLabels () {
            return this.eventLabels;
        },
        windowWidth () {
            return this.$store.state.windowWidth
        }
    },

    methods: {
        updateMonth (val) {
            this.showDate = this.$refs.calendar.getIncrementedPeriod(val);
        },

        openAddNewEvent (date) {
        /*const obj = { id: 10, title: 'Meta 0084', startDate: date, endDate: date}
        obj.classes = `event-${  this.labelColor('business')}`;
        this.events.push(obj);*/
        },

        openEditEvent(event){
            this.$router.push({name: 'calendario-meta-actividad', params: {id: event.id }}).catch(() => {});
        },

        getEventosTodos(){
            this.$vs.loading();
            this.$http.listarEventosTodos()
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200 && response.data.success){
                    let data = response.data.data;
                    let tmp = data[0].meta;
                    let k = 0;
                    data.forEach((element, index) => {
                        let parts_of_date = element.fecha.split("/");
                        let output = new Date(+parts_of_date[2], parts_of_date[1] - 1, +parts_of_date[0]);

                        const obj = { 
                            id: element.id, 
                            title: element.meta, 
                            startDate: output, 
                            endDate: output
                        };

                        if(tmp === element.meta){
                            obj.classes = this.colorLabel[k];
                        } else {
                            tmp = element.meta;
                            k++;
                            if(k === 4){
                                k = 0;
                            }
                            obj.classes = this.colorLabel[k];
                        }
                        this.events.push(obj);
                    });
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.events = [];
            });
        },

        getEventosPorMeta(numMeta){
            this.$vs.loading();
            this.$http.listarEventosPorMeta(numMeta)
            .then(response => {
                this.$vs.loading.close();
                if(response.status === 200 && response.data.success){
                    let data = response.data.data;
                    let tmp = data[0].meta;
                    let k = 0;
                    data.forEach(element => {
                        let parts_of_date = element.fecha.split("/");
                        let output = new Date(+parts_of_date[2], parts_of_date[1] - 1, +parts_of_date[0]);

                        const obj = { 
                            id: element.id, 
                            title: element.meta, 
                            startDate: output, 
                            endDate: output
                        };

                        if(tmp === element.meta){
                            obj.classes = this.colorLabel[k];
                        } else {
                            tmp = element.meta;
                            k++;
                            if(k === 4){
                                k = 0;
                            }
                            obj.classes = this.colorLabel[k];
                        }
                        this.events.push(obj);
                    });
                }
            }).catch(error => {
                this.$vs.loading.close();
                this.events = [];
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        showMessageAlert(message){
            this.$vs.notify({
                title: 'Aviso',
                text: message,
                position:'top-center',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger'
            });
        },

        showMessageSuccess(message){
            this.$vs.notify({
                title: 'Información',
                text: message,
                position:'top-right',
                iconPack: 'feather',
                icon: 'icon-check',
                color: 'success'
            });
        },

        showMessageError(status, message){
            if(status === 400 || status === 409){
                this.$vs.notify({
                    title: 'Aviso',
                    text: message,
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'warning'
                });
            }
            if(status === 401){
                this.popupRiesgo = false;
                this.popupEliminar = false;
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }
            if(status === 403){
                this.popupRiesgo = false;
                this.popupEliminar = false;
                this.$vs.notify({
                    title: 'ACCESO DENEGADO',
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
                    color: 'warning'
                });
            }
            if(status === 417){
                this.$vs.notify({
                    title: 'ALERTA',
                    text: message,
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    color: 'danger'
                });
            }

            if(status === 500){
                this.$vs.notify({
                    title: 'ERROR',
                    text: 'Ups!!!. Ocurrio un error. Vuelve a intentarlo.',
                    position:'top-center',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    color: 'danger'
                });
            }
        },

    },

    beforeDestroy () {
        this.$store.unregisterModule('calendar')
    },

}
</script>
<style lang="scss">
@import "@/assets/scss/vuexy/apps/simple-calendar.scss";
</style>