import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes: [
        {
            path: '',
            component: () => import('./layouts/main/Main.vue'),
            meta: {
              requiresAuth: true
            },
            children: [
                {
                    path: '/',
                    name: 'home',
                    component: () => import('./views/pages/home/Home.vue')
                }, {
                    path: '/actividad/diaria/meta',
                    name: 'actividad-diaria-meta',
                    component: () => import('@/views/pages/meta/Meta.vue'),
                    meta: {
                        adminAuth: true,
                        breadcrumb: [
                            { title: 'Metas', active: true }
                        ],
                        pageTitle: 'Actividades por Metas'
                    }
                }, {
                    path: '/actividad/diaria/localizacion',
                    name: 'actividad-diaria-localizacion',
                    component: () => import('@/views/pages/meta/Localizacion.vue'),
                    meta: {
                        adminAuth: true,
                        breadcrumb: [
                            { title: 'Calendatio', active: true }
                        ],
                        pageTitle: 'Actividades por Metas'
                    }
                }, {
                    path: '/calendario/listar',
                    name: 'calendario-meta',
                    component: () => import('@/views/pages/calendario/MainCalendar.vue'),
                    children: [
                        {
                            path: '',
                            name: 'calendario-meta',
                            component: () => import('@/views/pages/calendario/CalendarioPage.vue'),
                            meta: {
                                adminAuth: true,
                                breadcrumb: [
                                    { title: 'Inicio', url: '/' },
                                    { title: 'Calendario de actividades', active: true }
                                ],
                                parent: 'calendario-meta',
                                no_scroll: true,
                                pageTitle: 'Calendario'
                            }
                        }, {
                            path: '/calendario/listar/:id',
                            name: 'calendario-meta-actividad',
                            component: () => import('@/views/pages/calendario/Actividad.vue'),
                            meta: {
                                adminAuth: true,
                                breadcrumb: [
                                    { title: 'Inicio', url: '/' },
                                    { title: 'Calendario de actividades', url: '/calendario/listar' },
                                    { title: 'Actividades registradas', active: true }
                                ],
                                parent: 'calendario-meta',
                                no_scroll: true,
                                pageTitle: 'Calendario'
                            }
                        }
                    ],
                }, {
                    path: '/reporte/diario/meta',
                    name: 'reporte-diario-meta',
                    component: () => import('@/views/pages/reports/ReporteMeta.vue'),
                    meta: {
                        adminAuth: true,
                        breadcrumb: [
                            { title: 'Reporte mensual', active: true }
                        ],
                        pageTitle: 'Reportes de actividades'
                    }
                }, {
                    path: '/reporte/diario/responsable',
                    name: 'reporte-diario-responsable',
                    component: () => import('@/views/pages/reports/ReporteResponsable.vue'),
                    meta: {
                        adminAuth: true,
                        breadcrumb: [
                            { title: 'Reporte mensual por responsable', active: true }
                        ],
                        pageTitle: 'Reportes de actividades'
                    }
                }, {
                    path: '/app/miproyecto/parametro/meta',
                    name: 'app-miproyecto-parametro-meta',
                    component: () => import('@/views/pages/admin/Meta.vue'),
                    meta: {
                        adminAuth: true,
                        breadcrumb: [
                            { title: 'Metas', active: true }
                        ],
                        pageTitle: 'Mantenimiento de parámetros'
                    }
                }, {
                    path: '/app/miproyecto/parametro/cargo',
                    name: 'app-miproyecto-parametro-cargo',
                    component: () => import('@/views/pages/admin/Cargo.vue'),
                    meta: {
                        adminAuth: true,
                        breadcrumb: [
                            { title: 'Cargos', active: true }
                        ],
                        pageTitle: 'Mantenimiento de parámetros'
                    }
                }, {
                    path: '/usuario/acceso/personal',
                    name: 'usuario-acceso-personal',
                    component: () => import('@/views/pages/acceso/MainPersonal.vue'),
                    children: [
                        {
                            path: '',
                            name: 'usuario-acceso-personal',
                            component: () => import('./views/pages/acceso/Personal.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Inicio', url: '/' },
                                    { title: 'Persona', active: true }
                                ],
                                pageTitle: 'Usuarios y Acceso',
                                no_scroll: true,
                                parent: 'usuario-acceso-personal'
                            }
                        }, {
                            path: '/usuario/acceso/personal/detalle/:id',
                            name: 'usuario-acceso-personal-detalle',
                            component: () => import('./views/pages/acceso/DetallePersonal.vue'),
                            meta: {
                                breadcrumb: [
                                    { title: 'Inicio', url: '/' },
                                    { title: 'Usuarios y Acceso', url: '/usuario/acceso/personal' },
                                    { title: 'Detalle', active: true }
                                ],
                                pageTitle: 'Usuarios y Acceso',
                                parent: 'usuario-acceso-personal'
                            },
                        }
                    ]
                }, {
                    path: '/usuario/acceso/asignacion',
                    name: 'usuario-acceso-asignacion',
                    component: () => import('@/views/pages/acceso/Asignacion.vue'),
                    meta: {
                        adminAuth: true,
                        breadcrumb: [
                            { title: 'Asignación de Metas/Proyectos a personal', active: true }
                        ],
                        pageTitle: 'Usuarios y Acceso'
                    }
                }
            ],
        }, {
            path: '',
            component: () => import('@/layouts/full-page/FullPage.vue'),
            meta: {
              requiresVisitor: true
            },
            children: [
              {
                path: '/pages/login',
                name: 'page-login',
                component: () => import('@/views/pages/Login.vue')
              }, {
                path: '/pages/error-404',
                name: 'page-error-404',
                component: () => import('@/views/pages/Error404.vue')
              }, {
                path: '/pages/politicas/privacidad',
                name: 'page-politicas-privacidad',
                component: () => import('@/views/pages/PoliticasPrivacidad.vue')
              },
            ]
        }, {
            path: '*',
            redirect: '/'
        }
    ],
})

router.afterEach(() => {
  const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

export default router
