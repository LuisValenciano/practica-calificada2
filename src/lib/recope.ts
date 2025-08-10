import { api } from './api';
export const getPrecioConsumidor = () => api('/api/Recope/precio-consumidor'); // público
export const getPrecioPlantel   = () => api('/api/Recope/precio-plantel');     // público
export const getPrecioIntl      = (inicio: string, fin: string) =>
  api(`/api/Recope/precio-internacional?inicio=${inicio}&fin=${fin}`);         // público
