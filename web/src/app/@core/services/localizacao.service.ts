import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {
  constructor(private http: HttpClient) {}

  async obterLocalizacaoFormatada(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Obter coordenadas do navegador
      navigator.geolocation.getCurrentPosition(
        async position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          try {
            // Consulta à API Nominatim (OpenStreetMap)
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
            const resposta: any = await this.http.get(url).toPromise();

            const cidade = resposta.address.city || resposta.address.town || resposta.address.village || 'Localidade desconhecida';

            // Formatar data
            const data = new Date().toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            });

            resolve(`${cidade}, ${data}`);
          } catch (erro) {
            reject('Erro ao consultar a API de localização');
          }
        },
        erro => {
          reject('Permissão de localização negada ou erro ao obter coordenadas.');
        }
      );
    });
  }
}
