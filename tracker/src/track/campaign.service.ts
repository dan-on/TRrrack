export class CampaignService {
  campaigns = {
    sadadasdasdasdad: {
      targetUrl: 'http://google.com',
      redirectType: 2,
      costs: {
        click: { 
          cost: 0.3, 
          currency: 'RUR' 
        },
      },
      revenues: {
        conversion: { 
          revenue: 0.3, 
          percent: 25, 
          currency: 'USD' 
        }
      }
    },
    abcdcef123456789: {
      targetUrl: 'http://example.com',
      redirectType: 1,
      flow: [
        {
          flowId: '34433344343dsf',
          url: 'http://yandex.ru',
          weight: 10000,
          filter: {
            
          },
        }
      ]
    }
  }
}