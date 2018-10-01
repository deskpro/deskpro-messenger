import FakeApiService from './FakeApiService';
import PollingApiService from './PollingApiService';

const apiService = new (process.env.API_SERVICE === 'polling'
  ? PollingApiService
  : FakeApiService)();

export default apiService;
