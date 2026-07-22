import { Provider } from 'react-redux';
import { store } from './redux/store';
import ComplaintIntakeSystem from './components/ComplaintIntakeSystem';

function App() {
  return (
    <Provider store={store}>
      <div className="font-inter">
        <ComplaintIntakeSystem />
      </div>
    </Provider>
  );
}

export default App;
