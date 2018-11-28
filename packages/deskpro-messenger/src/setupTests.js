require('jest-extended');
// add some helpful assertions
require('jest-dom/extend-expect');

// this is basically: afterEach(cleanup)
require('react-testing-library/cleanup-after-each');

jest.setTimeout(30000);
