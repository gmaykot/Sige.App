// `ng build --env=stg` then `environment.staging.ts` will be used instead.

export const environment = {
  production: false,
  base_api_url: '${BASE_API_URL}',  
  base_cep_url: 'https://viacep.com.br/ws/{cep}/json/',  
  gestor: 'COENEL-DE'
};
