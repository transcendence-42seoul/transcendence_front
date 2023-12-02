import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RecoilRoot } from 'recoil';
import { CookiesProvider } from 'react-cookie';

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RecoilRoot>
    {/* <React.StrictMode> */}
    <QueryClientProvider client={queryClient}>
      <CookiesProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CookiesProvider>
    </QueryClientProvider>
    {/* </React.StrictMode> */}
  </RecoilRoot>,
);
