import FakeApiService from './FakeApiService';
import ApiService from './ApiService';

const createApiService = (type = 'real') =>
  new (type === 'real' ? ApiService : FakeApiService)();

export default createApiService;
