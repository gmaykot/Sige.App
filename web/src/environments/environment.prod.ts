// `ng build --env=prod` then `environment.prod.ts` will be used instead.

export const environment = {
  production: true,
  base_api_url: "${BASE_API_URL}",
  base_cep_url: "https://viacep.com.br/ws/{cep}/json/",
};
