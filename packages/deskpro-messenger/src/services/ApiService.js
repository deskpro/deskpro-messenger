import FakeApiService from './FakeApiService';
import PollingApiService from './PollingApiService';

const apiService = new (process.env.REACT_APP_API_SERVICE === 'polling'
  ? PollingApiService
  : FakeApiService)();

export default apiService;
