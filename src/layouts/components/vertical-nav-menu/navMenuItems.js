export default [
  {
    url: "/",
    name: "Inicio",
    slug: "home",
    icon: "HomeIcon",
}, {
    url: null,
    name: "Por Metas",
    slug: "actividad-diaria",
    icon: "GridIcon",
    submenu: [
      {
        url: "/actividad/diaria/meta",
        name: "Metas",
        slug: "actividad-diaria-meta",
      }, {
        url: "/actividad/diaria/localizacion",
        name: "Localización",
        slug: "actividad-diaria-localizacion",
      }
    ]
  }, {
    url: "/calendario/listar",
    name: "Calendario",
    slug: "calendario-meta",
    icon: "CalendarIcon",
  }, 
  
  {
    url: null,
    name: "Reportes",
    slug: "reporte-diaria",
    icon: "GridIcon",
    submenu: [
      {
        url: "/reporte/diario/meta",
        name: "Reporte por metas",
        slug: "reporte-diario-meta",
      }, {
        url: "/reporte/diario/responsable",
        name: "Reporte por responsables",
        slug: "reporte-diario-responsable",
      }
    ]
  }, {
    url: null,
    name: "Mant. paramétros",
    slug: "app-miproyecto-parametro",
    icon: "DatabaseIcon",
    submenu: [
      {
        url: "/app/miproyecto/parametro/meta",
        name: "Metas",
        slug: "app-miproyecto-parametro-meta",
      }, {
        url: "/app/miproyecto/parametro/cargo",
        name: "Cargos",
        slug: "app-miproyecto-parametro-cargo",
      }
    ]
  }, {
    url: null,
    name: "Usuario y Acceso",
    slug: "usuario-acceso",
    icon: "UsersIcon",
    submenu: [
      {
        url: "/usuario/acceso/personal",
        name: "Personal",
        slug: "usuario-acceso-personal",
      }, {
        url: "/usuario/acceso/asignacion",
        name: "Asignación",
        slug: "usuario-acceso-asignacion",
      },
    ]
  }
  
]
