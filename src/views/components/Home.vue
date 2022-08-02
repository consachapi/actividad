<template>
    <vx-card title="Registro de Fichas de Sintomatología">

        <p class="mb-4">Ficha de sintomatología de la <strong>COVID-19</strong> para regreso al trabajo <code>Declaración Jurada</code></p>

        <vs-table stripe :data="fichas" pagination :max-items="itemsPerPage">

            <template slot="thead">
                <vs-th>Descripción</vs-th>
				<vs-th>Fecha apertura</vs-th>
				<vs-th>Fecha cierre</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Ficha</vs-th>
                <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :state="data[indextr].st == 6 ? 'danger' : null" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].encuesta">
                        {{data[indextr].encuesta}}
                    </vs-td>
					<vs-td :data="data[indextr].inicio">
                        {{data[indextr].inicio}}
                    </vs-td>
					<vs-td :data="data[indextr].fin">
                        {{data[indextr].fin}}
                    </vs-td>
                    <vs-td :data="data[indextr].estado">
						<vs-chip transparent :color="getOrderStatusColorCampania(data[indextr].stcampania)">
							{{data[indextr].estado}}
						</vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr].id">
						<vs-chip :color="getOrderStatusColor(data[indextr].st)" class="product-order-status">{{data[indextr].ficha}}</vs-chip>
                    </vs-td>
                    <vs-td :data="data[indextr].id" class="whitespace-no-wrap">
						<feather-icon icon="EditIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current" @click="registrarFicha(tr)"/>
						<feather-icon icon="FileTextIcon" svgClasses="w-5 h-5 hover:text-primary stroke-current" class="ml-2" @click="verFicha(tr)"/>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
		<vs-popup class="holamundo"  title="Info!!!" :active.sync="popupActivo">
            <p> Ficha de Sintomatología <strong>{{ messajeEstado }}</strong></p>
        </vs-popup>
		<vs-popup class="holamundo"  title="Info!!!" :active.sync="popupCompletado">
            <p><code>{{ messajeCompletado }}</code>, <strong>registrado satisfactoriamente.</strong></p>
        </vs-popup>

		<vs-popup classContent="popup-example" title="" :active.sync="popupPreguntas">
			<vx-card
				title-color="dart"
				title="En los últimos 14 días, he tenido alguno de los sítomas siguientes:">
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<label>Sensación de alza térmica o fiebre</label>
						<div class="vx-row">
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio v-model="radios1" vs-name="radios1" vs-value="S1">SI</vs-radio>
							</div>
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio color="dark" v-model="radios1" vs-name="radios1" vs-value="N1">NO</vs-radio>
							</div>
						</div>
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<label>Tos, estornudos o dificultades para respirar</label>
						<div class="vx-row">
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio v-model="radios2" vs-name="radios2" vs-value="S2">SI</vs-radio>
							</div>
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio color="dark" v-model="radios2" vs-name="radios2" vs-value="N2">NO</vs-radio>
							</div>
						</div>
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<label>Expectoración o flema amarilla o verdoso</label>
						<div class="vx-row">
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio v-model="radios3" vs-name="radios3" vs-value="S3">SI</vs-radio>
							</div>
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio color="dark" v-model="radios3" vs-name="radios3" vs-value="N3">NO</vs-radio>
							</div>
						</div>
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<label>Pérdida de olfato o pérdida del gusto</label>
						<div class="vx-row">
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio v-model="radios4" vs-name="radios4" vs-value="S4">SI</vs-radio>
							</div>
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio color="dark" v-model="radios4" vs-name="radios4" vs-value="N4">NO</vs-radio>
							</div>
						</div>
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<label>Contacto con persona(s) con un caso confirmado de COVID-19</label>
						<div class="vx-row">
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio v-model="radios5" vs-name="radios5" vs-value="S5">SI</vs-radio>
							</div>
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio color="dark" v-model="radios5" vs-name="radios5" vs-value="N5">NO</vs-radio>
							</div>
						</div>
					</div>
				</div>
				<div class="vx-row mb-6">
					<div class="vx-col w-full">
						<label>¿Esta tomando alguna medicación?</label>
						<div class="vx-row">
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio v-model="radios6" vs-name="radios6" vs-value="S6">SI</vs-radio>
							</div>
							<div class="vx-col sm:w-1/4 w-full mb-2">
								<vs-radio color="dark" v-model="radios6" vs-name="radios6" vs-value="N6">NO</vs-radio>
							</div>
						</div>
						<vs-textarea counter="250" :counter-danger.sync="counterDanger" :disabled="disableDetalle" label="Detallar ¿cuál o cuales" v-model="detalle"/>
					</div>
				</div>
			</vx-card>
			<vs-divider></vs-divider>
			<div class="vx-row">
				<div class="vx-col w-full">
					<vs-button @click=" edit ? editarFicha() : guardarFicha()" class="mr-3 mb-2">Guardar</vs-button>
					<vs-button @click="popupPreguntas=false" color="warning" type="border" class="mb-2">Cancelar</vs-button>
				</div>
			</div>
		</vs-popup>
		<vs-popup class="holamundo"  title="Info!!!" :active.sync="popupFichaReporte">
            <p> Ficha de Sintomatología</p>
        </vs-popup>
    </vx-card>
</template>

<script>
import axios from 'axios';
import { apiUrl } from '@/constants/config'
export default {
	data () {
		return {
			fichas:[],
			popupActivo: false,
			popupCompletado: false,
			messajeCompletado: "",
			messajeEstado: "",

			popupPreguntas: false,
			popupFichaReporte:false,
			encuestaId:0,
			id1:0,
			id2:0,
			id3:0,
			id4:0,
			id5:0,
			id6:0,
			radios1:'N1',
			radios2:'N2',
			radios3:'N3',
			radios4:'N4',
			radios5:'N5',
			radios6:'N6',
			detalle:'',
			counterDanger: false,
			edit: false,

			itemsPerPage: 10,
		}
	},
	created(){
		this.listFichas();
	},
	computed:{
        disableDetalle(){
          return this.radios6 === "S6" ? false : true;
        }
    },
	methods: {
		listFichas(){
			this.$vs.loading();
			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/encuesta/usuario/listar`,
				method: 'GET' 
			}).then(response =>{
				if(response.data.success){
					let data = response.data.data;
					data.forEach( (item) => {
						this.fichas.push({
							id:item.id,
							encuesta:item.campania.descripcion,
							inicio:item.campania.fechaApertura,
							fin:item.campania.fechaCierre,
							estado:item.campania.estado.descripcion,
							st:item.estado.id,
							ficha:item.estado.descripcion,
							stcampania: item.campania.estado.id
						});
					});
				}
				this.$vs.loading.close();
			}).catch(erro =>{
				this.$vs.loading.close();
				this.$store.dispatch("logout").then(() => {
					this.$router.push('/pages/login').catch(() => {})
				});
			});
		},

		getOrderStatusColorCampania(status) {
			if (status === 5)   return 'success'
			if (status === 4) return 'danger'
			return 'dark'
		},

		getOrderStatusColor (status) {
			if (status === 2 || status === 6)   return 'success'
			if (status === 3) return 'warning'
			if (status === 1)  return 'dark'
			return 'primary'
		},

		registrarFicha(data) {
			this.encuestaId = data.id;
			if(data.st === 2 || data.st === 6){
				if(data.stcampania == 5){
					this.getRespuestas();
				} else {
					this.popupCompletado=true;
					this.messajeCompletado = `${data.encuesta}`;
				}
			} 
			if(data.st === 1){
				this.popupPreguntas = true;
			} 
			if(data.st === 3 || data.st === 7) {
				this.popupActivo=true;
				this.messajeEstado = `${data.ficha}`;
			}
		},

		verFicha(data){
			if(data.st === 2 || data.st === 6){
				this.$router.push({
					name: 'ficha',
					params: { id: data.id}
				}).catch(() => {})
			} else {
				this.$vs.notify({
					title: 'Info!!!',
					text: 'Ficha de SIntomatología no registrado.',
					iconPack: 'feather',
					icon: 'icon-alert-circle',
					color: 'danger'
				});
			}
			
		},

		getRespuestas(){
			this.$vs.loading();
			this.detalle = '';
			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/encuesta/usuario/ver/${ this.encuestaId }`,
				method: 'GET' 
			}).then(response =>{
				if(response.data.success){
					this.popupPreguntas = true;
					this.$vs.loading.close();
					let data = response.data.data;
					if(response.data.total !== 6){
						this.edit = false;
						this.popupPreguntas = false;
						this.$vs.notify({
							title: 'Error',
							text: 'La cantidad de preguntas es ' + response.data.total,
							iconPack: 'feather',
							icon: 'icon-alert-circle',
							color: 'danger'
						});
						return;
					}
					data.forEach( (item) => {
						switch(item.pregunta.id) {
							case 1:
								this.id1 = item.id;
								this.radios1 = item.respuesta ? 'S1' : 'N1';
								break;
							case 2:
								this.id2 = item.id;
								this.radios2 = item.respuesta ? 'S2' : 'N2';
								break;
							case 3:
								this.id3 = item.id;
								this.radios3 = item.respuesta ? 'S3' : 'N3';
								break;
							case 4:
								this.id4 = item.id;
								this.radios4 = item.respuesta ? 'S4' : 'N4';
								break;
							case 5:
								this.id5 = item.id;
								this.radios5 = item.respuesta ? 'S5' : 'N5';
								break;
							case 6:
								this.id6 = item.id;
								this.radios6 = item.respuesta ? 'S6' : 'N6';
								this.detalle = item.observacion;
								break;
						}

					});
					this.edit = true;
				}
			}).catch(erro =>{
				this.edit = false;
				this.$vs.loading.close();
				if(erro.response.status === 400){
					this.$vs.notify({
						title: 'Error',
						text: 'Ocurrio un error inesperado. Intente mas tarde.',
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					});
				}

				if(erro.response.status === 401){
					this.$vs.notify({
						title: 'Info!!!',
						text: 'La sesion ha expirado.',
						iconPack: 'feather',
						icon: 'icon-alert-circle',
						color: 'danger'
					});
					this.$store.dispatch("logout").then(() => {
						this.$router.push('/pages/login').catch(() => {})
					});
				}
			});
		},	

		guardarFicha(){
			this.$vs.loading();
			if(this.encuestaId !== 0){
				const paramsData = [
					{ 
						pregunta: { id: 1 }, 
						respuesta: (this.radios1 === 'S1' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: '',
						origen: 0
					},
					{ 
						pregunta: { id: 2 },
						respuesta: (this.radios2 === 'S2' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: '',
						origen: 0
					},
					{ 
						pregunta: { id: 3 },
						respuesta: (this.radios3 === 'S3' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: '',
						origen: 0
					},
					{ 
						pregunta: { id: 4 },
						respuesta: (this.radios4 === 'S4' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: '',
						origen: 0
					},
					{ 
						pregunta: { id: 5 },
						respuesta: (this.radios5 === 'S5' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: '',
						origen: 0
					},
					{ 
						pregunta: { id: 6 },
						respuesta: (this.radios6 === 'S6' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: (this.radios6 === 'S6' ? this.detalle : ''),
						origen: 0
					}
				];
				axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
				axios({
					url: `${apiUrl}/encuesta/v1/usuario/registrar`,
					data: paramsData,
					method: 'POST'
				}).then(response =>{
					this.$vs.loading.close();
					if(response.data.success){
						this.edit = false;
						this.popupPreguntas = false;
						this.encuestaId = 0;
						this.fichas = [];
						this.listFichas();

						this.$vs.notify({
							title: 'Mensaje',
							text: response.data.msg,
							iconPack: 'feather',
							icon: 'icon-check',
							color: 'success'
						});
					} else {
						this.$vs.notify({
							title: 'Mensaje',
							text: response.data.msg,
							iconPack: 'feather',
							icon: 'icon-alert-circle',
							color: 'danger'
						});
					}
				}).catch(erro =>{
					this.edit = false;
					this.$vs.loading.close();
					this.popupPreguntas = false;
					if(erro.response.status === 400){
						this.$vs.notify({
							title: 'Error',
							text: 'Ocurrio un error inesperado. Intente mas tarde.',
							iconPack: 'feather',
							icon: 'icon-alert-circle',
							color: 'danger'
						});
					}

					if(erro.response.status === 401){
						this.$vs.notify({
							title: 'Info!!!',
							text: 'La sesion ha expirado.',
							iconPack: 'feather',
							icon: 'icon-alert-circle',
							color: 'danger'
						});
						this.$store.dispatch("logout").then(() => {
							this.$router.push('/pages/login').catch(() => {})
						});
					}
				});
			}
			
		},

		editarFicha(){
			this.$vs.loading();
			if(this.encuestaId !== 0){
				const paramsData = [
					{ 
						id: this.id1,
						pregunta: { id: 1 }, 
						respuesta: (this.radios1 === 'S1' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: '',
						origen: 0
					},
					{ 
						id: this.id2,
						pregunta: { id: 2 },
						respuesta: (this.radios2 === 'S2' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: '',
						origen: 0
					},
					{ 
						id: this.id3,
						pregunta: { id: 3 },
						respuesta: (this.radios3 === 'S3' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: '',
						origen: 0
					},
					{ 
						id: this.id4,
						pregunta: { id: 4 },
						respuesta: (this.radios4 === 'S4' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: '',
						origen: 0
					},
					{ 
						id: this.id5,
						pregunta: { id: 5 },
						respuesta: (this.radios5 === 'S5' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: '',
						origen: 0
					},
					{ 
						id: this.id6,
						pregunta: { id: 6 },
						respuesta: (this.radios6 === 'S6' ? true : false),
						encuesta: { id: this.encuestaId },
						observacion: (this.radios6 === 'S6' ? this.detalle : ''),
						origen: 0
					}
				];
				axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
				axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
				axios({
					url: `${apiUrl}/encuesta/usuario/editar/${ this.encuestaId }`,
					data: paramsData,
					method: 'PUT',
				}).then(response =>{
					this.$vs.loading.close();
					if(response.data.success){
						this.edit = false;
						this.popupPreguntas = false;
						this.encuestaId = 0;
						this.fichas = [];
						this.listFichas();
						this.id1 = 0;
						this.id2 = 0;
						this.id3 = 0;
						this.id4 = 0;
						this.id5 = 0;
						this.id6 = 0;
						this.$vs.notify({
							title: 'Mensaje',
							text: response.data.msg,
							iconPack: 'feather',
							icon: 'icon-check',
							color: 'success'
						});
					} else {
						this.$vs.notify({
							title: 'Mensaje',
							text: response.data.msg,
							iconPack: 'feather',
							icon: 'icon-alert-circle',
							color: 'danger'
						});
					}
				}).catch(erro =>{
					this.edit = false;
					this.$vs.loading.close();
					this.popupPreguntas = false;
					if(erro.response.status === 400){
						this.$vs.notify({
							title: 'Error',
							text: 'Ocurrio un error inesperado. Intente mas tarde.',
							iconPack: 'feather',
							icon: 'icon-alert-circle',
							color: 'danger'
						});
					}

					if(erro.response.status === 401){
						this.$vs.notify({
							title: 'Info!!!',
							text: 'La sesion ha expirado.',
							iconPack: 'feather',
							icon: 'icon-alert-circle',
							color: 'danger'
						});
						this.$store.dispatch("logout").then(() => {
							this.$router.push('/pages/login').catch(() => {})
						});
					}
				});
			}
			
		}
	},
}
</script>
