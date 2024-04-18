import { TailSpin, Bars } from 'react-loader-spinner';

const Loader_bar = () => {
  return (
  <div style={{ textAlign: 'center', padding: '50px',alignSelf:'center' }}>
    <Bars color="#00BFFF" height={80} width={80} />
  </div>
  )
};
export default Loader_bar;
