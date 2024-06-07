import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import Loading from '../components/common/Loading';
import useFonts from '../configs/Fonts';
import { useAccount } from '../store/contexts/AccountContext';
import Theme from '../styles/Theme';
import MainStack from './MainStack';
import AuthStack from './stacks/AuthStack';

const Routers = () => {
   const fontsLoaded = useFonts();
   const account = useAccount();

   if (!fontsLoaded || account.loading) return <Loading />;

   return (
      <>
         <StatusBar animated={true} backgroundColor={Theme.PrimaryColor} />
         <NavigationContainer>{!account.isLoggedIn ? <AuthStack /> : <MainStack />}</NavigationContainer>
      </>
   );
};

export default Routers;
