import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import Loading from '../Components/Common/Loading';
import useFonts from '../Configs/Fonts';
import { useAccount } from '../Store/Contexts/AccountContext';
import Theme from '../Styles/Theme';
import AuthStack from './Stacks/AuthStack';
import MainStack from './Stacks/MainStack';

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
