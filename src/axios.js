import axios from 'axios';
import { apiUrl } from '@/constants/config'

const apiCliente =  axios.create({
    baseURL: apiUrl,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
    }
});

export default {
    getResumenUsuario(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/usuario/resumen`);
    },

    listarResidentesActivos(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/residente/listar`);
    },

    metadPorResidente(documento){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/residente/metas/${ documento }`);
    },

    listarEventosTodos(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/actividad/eventos`);
    },

    listarEventosPorMeta(numMeta){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/actividad/eventos/meta/${ numMeta }`);
    },

    listarActividadesPorMeta(id){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/actividad/listar/meta/${ id }`);
    },

    listarTodoActividades(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/actividad/listar`);
    },

    listarRegistrosPorActividad(id){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/actividad/listar/imagenes/${ id }`);
    },

    listarRegistrosTodo(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/actividad/listar/imagenes`);
    },

    getRegistro(id){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/actividad/registro/ver/${ id }`);
    },

    getMetasAndResidente(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/meta/responsable/listar`);
    },

    getMetasAndResidenteByFecha(fecha){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/meta/responsable/fecha/${fecha}`);
    },

    getMetasSelection(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/meta/seleccion`);
    },

    getLocalizationByMetaAndDate(meta, fecha){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/meta/localizacion/meta?meta=${ meta }&fecha=${ fecha }`);
    },

    getResidentes(meta, anio, mes){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/reporte/meta/responsable?meta=${meta}&anio=${anio}&mes=${mes}`);
    },

    generarReporte(meta, anio, mes){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/reporte/meta/documento?meta=${meta}&anio=${anio}&mes=${mes}`);
    },

    searchMeta(meta){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/meta/buscar/${meta}`);
    },

    getAllResidentes(oficina, anio, mes){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/reporte/meta/responsable/todo?oficina=${ oficina }&anio=${anio}&mes=${mes}`);
    },

    listOficinaActivo(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/oficina/seleccion/activo`);
    },

    searchMetaByReponsable(ndocumento){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/meta/buscar/residente/${ ndocumento }`);
    },
    
    /***********************USUARIOS************************** */

    getAllPersonal(page, size){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/residente/listar?page=${ page - 1 }&size=${ size }`);
    },

    buscarPersonal(termino, page, size){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/residente/buscar/${termino}?page=${ page - 1 }&size=${ size }`);
    },

    getCargo(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/cargo/seleccionar`);
    },

    getPerfil(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/perfil/seleccionar`);
    },

    getOficina(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/oficina/seleccionar`);
    },

    showPersona(ndocumento){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/residente/mostrar/${ ndocumento }`);
    },

    consultarPersona(ndocumento){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/residente/consultar/${ ndocumento }`);
    },

    createPersona(data){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.post(`/v1/residente/crear`, data);
    },

    editPersona(ndocumento, data){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.put(`/v1/residente/editar/${ ndocumento }`, data);
    },

    deletePersona(ndocumento){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.delete(`/v1/residente/eliminar/${ ndocumento }`);
    },

    metasAsignados(ndocumento){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/meta/asignacion/${ ndocumento }`);
    },

    asignarMetas(ndocumento, metas){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.post(`/v1/meta/asignar/${ ndocumento }`, metas);
    },

    /***********************PARAMETROS************************** */

    listarMetasTodo(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/meta/listar/todo`);
    },

    habilitar(id){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/meta/habilitar/${ id }`);
    },

    inhabilitar(id){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/meta/inhabilitar/${ id }`);
    },

    listarCargo(){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.get(`/v1/cargo/listar`);
    },

    crearCargo(cargo){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.post(`/v1/cargo/crear`, cargo);
    },
    
    editarCargo(id, cargo){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.put(`/v1/cargo/editar/${ id }`, cargo);
    },

    eliminarCargo(id){
        apiCliente.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        return apiCliente.delete(`/v1/cargo/eliminar/${ id }`);
    },

}

