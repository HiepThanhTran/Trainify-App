import { NavigationContainer } from '@react-navigation/native';
import Loading from '../components/Loading';
import useFonts from '../configs/Fonts';
import { useAccount } from '../store/contexts/AccountContext';
import AuthStack from './stacks/AuthStack';
import MainStack from './stacks/MainStack';

const Routers = () => {
    const fontsLoaded = useFonts();
    const account = useAccount();

    if (!fontsLoaded || account.loading) return <Loading />;

    return (
        <>
            {/* <StatusBar animated={true} barStyle="light-content" /> */}
            <NavigationContainer>{!account.isLoggedIn ? <AuthStack /> : <MainStack />}</NavigationContainer>
        </>
    );
};

export default Routers;
