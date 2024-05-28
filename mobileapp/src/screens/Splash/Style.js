import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from '../../styles/Style';
import Theme from '../../styles/Theme';

const SplashStyle = StyleSheet.create({
    OnboardingContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
        paddingTop: screenHeight / 10,
    },
    OnboardingImage: {
        width: screenWidth + 50,
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
