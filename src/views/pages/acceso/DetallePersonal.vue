<template>
    <div>
        <vx-card no-shadow card-border id="div-detalle-persona-with-loading" class="mt-base vs-con-loading__container">
            <div class="flex items-end">
                <feather-icon :icon="iconTitle" class="mr-2" svgClasses="w-5 h-5" />
                <span class="leading-none font-medium">{{ title }}</span>
            </div>

            <vs-divider/>

            <div class="vx-row">
                <div class="vx-col w-full md:w-1/2 mb-2">
                    <label class="text-sm opacity-75">Número de Documento de Identidad</label>
                    <div class="vx-row">
                        <div class="vx-col w-full md:w-1/2 mb-2">
                            <vs-input class="w-full" :readonly="enabledDocumento" v-model="inputDocumento" v-validate="'required|numeric'" name="documento" placeholder="Ingrese DNI"/>
                            <span class="text-danger text-sm" v-show="errors.has('documento')">{{ errors.first('documento') }}</span>
                        </div>

                        <div v-if="!enabledDocumento" class="vx-col w-full md:w-1/2">
                            <vs-button @click="buscarPersonal" icon-pack="feather" color="danger" type="border" icon="icon-search">Buscar</vs-button>
                        </div>

                    </div>
                </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full md:w-1/2 mb-2">                   
                    <div class="mb-2">
                        <label class="text-sm opacity-75">Nombres</label>
                        <vs-input class="w-full" readonly v-model="inputNombres" v-validate="'required'" name="nombres" placeholder="Ingrese nombres"/>
                        <span class="text-danger text-sm" v-show="errors.has('nombres')">{{ errors.first('nombres') }}</span>
                    </div>

                    <div class="mb-2">
                        <label class="text-sm opacity-75">Apellidos</label>
                        <vs-input class="w-full" readonly v-model="inputApellidos" v-validate="'required'" name="apellidos" placeholder="Ingrese apellidos"/>
                        <span class="text-danger text-sm" v-show="errors.has('apellidos')">{{ errors.first('apellidos') }}</span>
                    </div>

                    <div class="mb-2">
                        <label class="text-sm opacity-75">Email</label>
                        <vs-input class="w-full" readonly v-model="inputEmail" v-validate="'required|email'" type="email" name="correo" placeholder="Ingrese correo electrónico"/>
                        <span class="text-danger text-sm" v-show="errors.has('correo')">{{ errors.first('correo') }}</span>
                    </div>
                </div>
                
                <div class="vx-col w-full md:w-1/2 mb-2">
                    <div class="mb-2">
                        <label class="text-sm opacity-75">Telefono/Movil</label>
                        <vs-input class="w-full" readonly v-model="inputTelefono" v-validate="'numeric'" name="telefono" placeholder="Ingrese telf. movil o fijo"/>
                        <span class="text-danger text-sm" v-show="errors.has('telefono')">{{ errors.first('telefono') }}</span>
                    </div>

                    <div class="mb-2">
                        <label class="text-sm opacity-75">Dirección</label>
                        <vs-input class="w-full" readonly v-model="inputDireccion" v-validate="''" name="direccion" placeholder="Ingrese dirección"/>
                        <span class="text-danger text-sm" v-show="errors.has('direccion')">{{ errors.first('direccion') }}</span>
                    </div>

                    <div class="mb-2">
                        <label class="text-sm opacity-75">Oficina</label>
                        <v-select :options="itemsOficina" v-model="selectedOficina" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="cargo">
                            <template v-slot:no-options="{ searching }">
                                <template v-if="searching">
                                    No se encontraron resultados
                                </template>
                                <span v-else style="opacity: 0.5">No existen resultados</span>
                            </template>
                        </v-select>
                        <span class="text-danger text-sm" v-show="errors.has('area')">{{ errors.first('area') }}</span>
                    </div>
                
                </div>
                

            </div>

            <vs-divider/>

            <div class="vx-row">
                <div class="vx-col w-full md:w-1/2 mb-2">
                    <div class="mb-2">
                        <label class="text-sm opacity-75">Cargo</label>
                        <v-select :options="itemsCargo" v-model="selectedCargo" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="cargo">
                            <template v-slot:no-options="{ searching }">
                                <template v-if="searching">
                                    No se encontraron resultados
                                </template>
                                <span v-else style="opacity: 0.5">No existen resultados</span>
                            </template>
                        </v-select>
                        <span class="text-danger text-sm" v-show="errors.has('area')">{{ errors.first('area') }}</span>
                    </div>

                    <div class="mb-2">
                        <label class="text-sm opacity-75">Estado</label>
                        <v-select :options="itemsEstado" v-model="selectedEstado" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="estado">
                            <template v-slot:no-options="{ searching }">
                                <template v-if="searching">
                                    No se encontraron resultados
                                </template>
                                <span v-else style="opacity: 0.5">No existen resultados</span>
                            </template>
                        </v-select>
                        <span class="text-danger text-sm" v-show="errors.has('estado')">{{ errors.first('estado') }}</span>
                    </div>

                </div>

                <div class="vx-col w-full md:w-1/2 mb-2">
                    <div class="mb-2 vx-col w-full">
                        <label class="text-sm opacity-75">Perfil</label>
                        <v-select :options="itemsPeril" v-model="selectedPerfil" :clearable="false" :dir="$vs.rtl ? 'rtl' : 'ltr'" class="mb-4 md:mb-0" name="perfil">
                            <template v-slot:no-options="{ searching }">
                                <template v-if="searching">
                                    No se encontraron resultados
                                </template>
                                <span v-else style="opacity: 0.5">No existen resultados</span>
                            </template>
                        </v-select>
                        <span class="text-danger text-sm" v-show="errors.has('perfil')">{{ errors.first('perfil') }}</span>
                    </div>
                </div>

            </div>

            <div class="vx-col w-full mt-2">
                <div class="flex flex-wrap items-center justify-start">
                    <vs-button @click="guardar" icon-pack="feather" color="primary" icon="icon-save" class="ml-auto mt-2" :disabled="!validateForm">Guardar</vs-button>
                    <vs-button @click="regresar" icon-pack="feather" color="warning" type="border" icon="icon-rotate-ccw"  class="ml-4 mt-2">Regresar</vs-button>
                    <vs-button @click="clearForm" icon-pack="feather" color="danger" type="border" icon="icon-trash"  class="ml-4 mt-2">Limpiar</vs-button>
                </div>
            </div>

        </vx-card>
    </div>
</template>
<script>
import vSelect from 'vue-select';
export default {
    components: {
        vSelect
    },
    data(){
        return {
            title: 'Nuevo Personal',
            iconTitle: 'UserPlusIcon',

            enabledDocumento: false,

            inputDocumento: null,
            inputNombres: null,
            inputApellidos: null,
            inputEmail: null,
            inputTelefono: null,
            inputDireccion: null,
            inputAreaAbreviatura: null,
            inputArea: null,

            selectedOficina: null,
            selectedCargo: null,
            selectedPerfil: null,
            selectedEstado: null,

            itemsCargo: [],
            itemsPeril: [],
            itemsOficina: [],
            itemsEstado: [{ value: 1, label: 'ACTIVO' }, { value: 2, label: 'BLOQUEADO' }]

        }
    },
    created(){
        this.parametro = this.$route.params.id;
    },

    mounted(){
        this.getOficinas();
        this.getCargos();
        this.getPerfiles();

        if(this.parametro !== 'nuevo'){
            this.title = 'Actualizar Personal';
            this.enabledDocumento = true,
            this.getPersona(this.parametro);
        } else {
           this.enabledDocumento = false;
        }
    },

    computed: {
        validateForm(){
            return !this.errors.any() && this.inputDocumento !== null && this.inputNombres !== null && this.inputApellidos !== null && this.inputEmail !== null
            && (this.selectedIpress !== null || this.checkRoot) && this.selectedCargo !== null && this.selectedPerfil !== null && this.selectedEstado !== null;
        }
    },

    watch: {
        checkRoot(value){
            this.visibleIpress = !value;
        }
    },

    methods: {
        getCargos(){
            this.$vs.loading({
                container: '#div-detalle-persona-with-loading',
                scale: 0.7
            });
            this.$http.getCargo()
            .then(response => {
                this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                if(response.status === 200){
                    this.itemsCargo = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getPerfiles(){
            this.$vs.loading({
                container: '#div-detalle-persona-with-loading',
                scale: 0.7
            });
            this.$http.getPerfil()
            .then(response => {
                this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                if(response.status === 200){
                    this.itemsPeril = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getOficinas(){
            this.$vs.loading({
                container: '#div-detalle-persona-with-loading',
                scale: 0.7
            });
            this.$http.getOficina()
            .then(response => {
                this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                if(response.status === 200){
                    this.itemsOficina = response.data;
                }
            })
            .catch(error => {
                this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        buscarPersonal(){
            if(this.inputDocumento === null){
                this.showMessageAlert('Ingrese el número de documento a buscar');
                return;
            }

            this.$vs.loading({
                container: '#div-detalle-persona-with-loading',
                scale: 0.7
            });
            this.$http.consultarPersona(this.inputDocumento)
            .then(response => {
                this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                if(response.status === 200){
                    this.loadDataBusqueda(response.data);
                }
            })
            .catch(error => {
                this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        getPersona(value){
            if(value === null || value === ''){
                this.showMessageAlert('El valor a buscar no existe.');
                return;
            }
            this.$vs.loading({
                container: '#div-detalle-persona-with-loading',
                scale: 0.7
            });
            this.$http.showPersona(value)
            .then(response => {
                this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                if(response.status === 200){
                    this.loadData(response.data);
                }
            })
            .catch(error => {
                this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                this.showMessageError(error.response.status, error.response.data.message);
            });
        },

        loadDataBusqueda(data){
            this.inputDocumento = data.numDocumento;
            this.inputNombres = data.nombres;
            this.inputApellidos = data.apellidos;
            this.inputEmail = data.email;
            this.inputTelefono = data.telefono;
            this.inputDireccion = data.direccion;
            this.selectedOficina = { value: data.oficina.id, label: data.oficina.descripcion };
            this.selectedEstado = { value: 1, label: 'ACTIVO' };
        },

        loadData(data){
            this.enabledDocumento = true,
            this.inputDocumento = data.numDocumento;
            this.inputNombres = data.nombres;
            this.inputApellidos = data.apellidos;
            this.inputEmail = data.email;
            this.inputTelefono = data.telefono;
            this.inputDireccion = data.direccion;

            this.selectedOficina = { value: data.oficina.id, label: data.oficina.descripcion };
            this.selectedCargo = { value: data.cargo.id, label: data.cargo.descripcion };
            this.selectedPerfil = { value: data.perfil.id, label: data.perfil.descripcion };
            this.selectedEstado = data.enable ? { value: 1, label: 'ACTIVO' } : { value: 2, label: 'BLOQUEADO' };
        },

        guardar(){
            const data = {
                numDocumento: this.inputDocumento,
                cargo: { id: this.selectedCargo.value, descripcion: this.selectedCargo.label },
                perfil: { id: this.selectedPerfil.value, descripcion: this.selectedPerfil.label },
                estado: this.selectedEstado.value === 1 ? true : false,
            }

            if(!this.enabledDocumento){
                this.$vs.loading({
                    container: '#div-detalle-persona-with-loading',
                    scale: 0.7
                });
                this.$http.createPersona(data)
                .then(response => {
                    this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                    if(response.status === 201){
                        this.regresar();
                    }
                })
                .catch(error => {
                    this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                    this.showMessageError(error.response.status, error.response.data.message);
                });
            } else {
                this.$vs.loading({
                    container: '#div-detalle-persona-with-loading',
                    scale: 0.7
                });
                this.$http.editPersona(this.inputDocumento, data)
                .then(response => {
                    this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                    if(response.status === 200){
                        this.regresar();
                    }
                })
                .catch(error => {
                    this.$vs.loading.close('#div-detalle-persona-with-loading > .con-vs-loading');
                    this.showMessageError(error.response.status, error.response.data.message);
                });
            }

        },

        regresar(){
            this.$router.push({
				name: 'usuario-acceso-personal'
			}).catch(() => {});
        },

        clearForm(){
            this.enabledDocumento = this.parametro === 'nuevo' ? false : true,
            this.visibleIpress = true;

            this.inputDocumento = this.parametro === 'nuevo' ? null : this.inputDocumento,
            this.inputNombres = null;
            this.inputApellidos = null;
            this.inputEmail = null;
            this.inputTelefono = null;
            this.inputDireccion = null;
            this.inputArea = null;
            this.inputAreaAbreviatura = null;

            this.selectedCargo = null;
            this.selectedPerfil = null;
            this.selectedEstado = null;
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
                this.popupEliminarPersonal = false;
                this.$store.dispatch("logout").then(() => {
                    this.$router.push('/login').catch(() => {})
                });
            }
            if(status === 403){
                this.popupPaciente = false;
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
    }
}
</script>