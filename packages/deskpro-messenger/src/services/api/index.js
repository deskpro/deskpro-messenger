import FakeApiService from './FakeApiService';
import ApiService from './ApiService';

const createApiService = (config, type = 'real') =>
  new (type === 'real' ? ApiService : FakeApiService)(config);

export default createApiService;
