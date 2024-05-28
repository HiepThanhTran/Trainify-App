import { NavigationContainer } from '@react-navigation/native';
import Loading from '../components/Loading';
import useFonts from '../configs/Fonts';
import { useAccount } from '../store/contexts/AccountContext';
import MainStack from './stacks/MainStack';
import AuthStack from './stacks/AuthStack';

const Routers = () => {
    const fontsLoaded = useFonts();
    const account = useAccount();

    return (
        <>
            {!fontsLoaded || account.loading ? (
                <Loading />
            ) : (
                <NavigationContainer>{!account.isLoggedIn ? <AuthStack /> : <MainStack />}</NavigationContainer>
            )}
        </>
    );
};

export default Routers;
