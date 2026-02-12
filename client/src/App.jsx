import GlobalErrorBoundary from './components/common/GlobalErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import {ToastContainer} from 'react-toastify'
export default function App() {
  return (
    <>
    <GlobalErrorBoundary>
      <AppRoutes />
      <ToastContainer />
    </GlobalErrorBoundary>
    </>
  );
}
