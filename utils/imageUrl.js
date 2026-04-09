/**
 * imageUrl(path)
 *
 * Devuelve la URL correcta para una imagen según el entorno:
 *  - En producción: devuelve el path tal cual (los archivos existen en el servidor).
 *  - En desarrollo local: si el path es /uploads/..., lo redirige al
 *    proxy local (/api/image-proxy?path=...) que hace fetch desde producción.
 *
 * Uso: <img src={imageUrl(service.image_url)} />
 */
export function imageUrl(path) {
  if (!path) return '/assets/placeholder.jpg';

  // Si ya es una URL absoluta, úsala directamente
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Solo redirigir al proxy si estamos en el cliente en localhost
  // (en producción los archivos existen físicamente en /uploads/)
  if (
    path.startsWith('/uploads/') &&
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ) {
    return `/api/image-proxy?path=${encodeURIComponent(path)}`;
  }

  return path;
}

