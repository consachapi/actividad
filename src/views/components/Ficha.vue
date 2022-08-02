<template>
	<div id="user-data">
		<vx-card 
			title="FICHA DE SINTOMATOLOGIA COVID-19 PARA REGRESO AL TRABAJO"
			subtitle="DECLARACION JURADA"
			class="mb-base">
			<p class="mb-3">He recibido explicación del objetivo de esta evaluación y me comprometo a responder con la verdad.</p>
			
			<div class="vx-row">
				<div class="vx-col flex-1" id="account-info-col-1" >
					<table>
						<tr>
							<td class="font-semibold">Entidad Pública</td>
							<td>: {{ entidad }}</td>
						</tr>
					</table>
				</div>
	
				<div class="vx-col flex-1" id="account-info-col-2">
					<table>
						<tr>
							<td class="font-semibold">RUC</td>
							<td>: 20527147612</td>
						</tr>
					</table>
				</div>

			</div>
			<div class="vx-row">
				<div class="vx-col flex-1" id="account-info-col-1" >
					<table>
						<tr>
							<td class="font-semibold">Gerencia/Subgerencia/Dirección</td>
							<td>: {{ gerencia }}</td>
						</tr>
						<tr>
							<td class="font-semibold">Area de trabajo</td>
							<td>: {{ area }}</td>
						</tr>
						<tr>
							<td class="font-semibold">Apellidos y Nombres</td>
							<td>: {{ nombres }}</td>
						</tr>
						<tr>
							<td class="font-semibold">DNI</td>
							<td>: {{ dni }}</td>
						</tr>
						<tr>
							<td class="font-semibold">Celular</td>
							<td>: {{ movil }}</td>
						</tr>
						<tr>
							<td class="font-semibold">Dirección</td>
							<td>: {{ direccion }}</td>
						</tr>
					</table>
				</div>
			</div>

			<vs-divider/>

			<p class="mb-3">En los últimos 14 días calendario he tenido alguno de los sintomas siguientes:</p>
			
			<div class="vx-row">
				<div class="vx-col flex-1 mb-3" id="account-info-col-1">
					<table>
						<tr :key="indextr" v-for="(tr, indextr) in preguntas">
							<td class="font-semibold">{{preguntas[indextr].desc}}</td>
						</tr>
					</table>
				</div>
	
				<div class="vx-col flex-1" id="account-info-col-2">
					<table>
						<tr :key="indextr" v-for="(tr, indextr) in preguntas">
							<td>{{ preguntas[indextr].respuesta }}</td>
						</tr>
					</table>
				</div>

			</div>
			<p class="font-semibold">Detallar ¿cuál o cuáles?</p>
			<p> {{ detalle }} </p>
			<vs-divider/>
			<p class="mb-3">Todos los datos expresado en esta ficha constituyen una declaración jurada de mi parte. 
				He sido informado que, de omitir o falsear información, puedo perjudicar la salud de mis compañeros y la mia 
				propia, lo cual constituye una falta grave a la salud pública, asumo sus consecuencias.
			</p>

			<div class="vx-row">
				<div class="vx-col flex-1" id="account-info-col-1">
					<table>
					<tr>
						<td class="font-semibold">Fecha: </td>
						<td> {{ fecha }}</td>
					</tr>
					</table>
				</div>
			</div>

			<vs-divider/>

			<div class="vx-col w-full flex" id="account-manage-buttons">
				<vs-button type="border" color="danger" icon-pack="feather" icon="icon-trash" @click="regresar">Aceptar</vs-button>
			</div>
		</vx-card>
	</div>
</template>

<script>
import axios from 'axios';
import { apiUrl } from '@/constants/config'
export default {
	data() {
		return {
			parametro: null,
			entidad: 'GOBIERNO REGIONAL DE CUSCO',
			gerencia: '',
			area:'',
			nombres:'',
			dni:'',
			movil:'',
			direccion: '',
			preguntas:[],
			detalle:'',
			fecha:''
		}
	},
	created() {
		this.parametro = this.$route.params.id;
		this.getUsuario(this.parametro);
	},

	methods: {
		regresar(){
			this.$router.push('/').catch(() => {})
		},

		getUsuario(params){
			this.$vs.loading();
			this.detalle = '';
			axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
			axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
			axios({
				url: `${apiUrl}/encuesta/usuario/ver/${ params }`,
				method: 'GET' 
			}).then(response =>{
				this.preguntas = [];
				if(response.data.success){
					let data = response.data.data;
					data.forEach( (item) => {
						const pregunta = {
							id: item.pregunta.id,
							desc: item.pregunta.descripcion,
							respuesta: item.respuesta ? 'Si' : 'No'
						}
						this.preguntas.push(pregunta);
						this.detalle = item.pregunta.id === 6 ? item.observacion : '';
						this.fecha = item.encuesta.campania.fechaCierre;

						this.gerencia = item.encuesta.personal.oficina;
						this.area = item.encuesta.personal.area;
						this.nombres = item.encuesta.personal.apellidos + ' ' + item.encuesta.personal.nombres;
						this.dni = item.encuesta.personal.numeroDocumento;
						this.movil = item.encuesta.personal.telefono;
						this.direccion = item.encuesta.personal.direccion;
					});
				}
				this.$vs.loading.close();
			}).catch(erro =>{
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
		}
	}
}
</script>
