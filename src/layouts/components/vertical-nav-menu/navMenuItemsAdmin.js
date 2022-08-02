export default [
    {
      url: null,
      name: "Actividades",
      slug: "home",
      icon: "HomeIcon",
      submenu: [
        {
          url: "/",
          name: "Metas y residentes",
          slug: "actividad-metas-residente",
        }, {
          url: "/actividad/listar",
          name: "Actividades meta",
          slug: "actividad-listar",
        }, {
          url: "/registro/listar",
          name: "Registro de actividad",
          slug: "registro-listar",
        }, {
          url: "/detalle/registro/ver",
          name: "Registro detalle",
          slug: "registro-listar-detalle",
        }
      ]
    }, {
      url: "/calendario",
      name: "Calendario",
      slug: "calendario-meta",
      icon: "CalendarIcon",
    }, 
    /*
    {
      url: null,
      name: "Mant. parametros",
      slug: "page2",
      icon: "ServerIcon",
      submenu: [
        {
          url: "/residente",
          name: "Residente",
          slug: "app-user-list",
        }, {
          url: "/meta",
          name: "Metas",
          slug: "app-user-edit",
        }
      ]
    }, 
    
    {
      url: null,
      name: "Usuario y acceso",
      slug: "page2",
      icon: "UserIcon",
      submenu: [
        {
          url: "/usuario",
          name: "Usuario",
          slug: "app-user-list",
        },
      ]
    }, {
      url: null,
      name: "Configuración",
      slug: "page2",
      icon: "SettingsIcon",
      submenu: [
        {
          url: "/parametro",
          name: "Parametros",
          slug: "app-user-list",
        },
      ]
    }
*/
  ]
  