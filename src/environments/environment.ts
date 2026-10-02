// src/environments/environment.ts (producción — usado dentro del Dockerfile)
export const environment = {
    production: true,
    apiUrl: '/api' // ruta relativa: nginx la redirige internamente al backend (ver nginx.conf)
};
