import FakeChatService from './FakeChatService';
import PollingChatService from './PollingChatService';

export default (process.env.API_SERVICE === 'polling'
  ? PollingChatService
  : FakeChatService);
