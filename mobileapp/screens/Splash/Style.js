import { Dimensions, StyleSheet } from 'react-native';
import Theme from '../../styles/Theme';

//Size Image
const { width, height } = Dimensions.get('screen');

const SplashStyle = StyleSheet.create({
    OnboardingContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
        paddingTop: height / 10,
    },
    OnboardingImage: {
        width: width + 50,
        height: 330,
        resizeMode: 'contain',
    },
    OnboardingTitle: {
        fontSize: 28,
        marginTop: 60,
        fontFamily: Theme.Bold,
    },
    OnboardingDescription: {
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        lineHeight: 30,
        fontFamily: Theme.SemiBold,
    },
    Button: {
        fontWeight: '600',
        fontSize: 16,
        fontFamily: Theme.SemiBold,
    },
});

export default SplashStyle;
