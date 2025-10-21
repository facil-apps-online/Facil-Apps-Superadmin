import {
  Users,
  Settings,
  BarChart3,
  ShieldAlert,
  Server,
  FileText,
  Book,
  Languages
} from 'lucide-react';

export const superadminNavigationConfig = [
  {
    group: "Gestión Principal",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: BarChart3,
        roles: ['super_admin']
      },
      {
        title: "Tenants",
        url: "/tenants",
        icon: Users,
        roles: ['super_admin']
      }
    ]
  },
  {
    group: "Administración",
    items: [
      {
        title: "Plataformas",
        url: "/platforms",
        icon: Server,
        roles: ['super_admin']
      },
      {
        title: "Gestión de Accesos",
        url: "/access-management",
        icon: Users,
        roles: ['super_admin']
      },
      {
        title: "Crear Usuario",
        url: "/user-management",
        icon: Users,
        roles: ['super_admin']
      }
    ]
  },
  {
    group: "Sistema",
    items: [
      {
        title: "Catálogos del Sistema",
        url: "/system-catalogs",
        icon: Book,
        roles: ['super_admin']
      },
      {
        title: "Integraciones",
        url: "/integrations",
        icon: Server,
        roles: ['super_admin']
      },
      {
        title: "Traducciones",
        url: "/translations",
        icon: Languages,
        roles: ['super_admin']
      }
    ]
  },
  {
    group: "Monitorización",
    items: [
      {
        title: "Alertas del Sistema",
        url: "/system-alerts",
        icon: ShieldAlert,
        roles: ['super_admin']
      },
      {
        title: "Reportes de Errores",
        url: "/error-reports",
        icon: FileText,
        roles: ['super_admin']
      },
      {
        title: "Métricas de Rendimiento",
        url: "/performance-metrics",
        icon: BarChart3,
        roles: ['super_admin']
      }
    ]
  }
];