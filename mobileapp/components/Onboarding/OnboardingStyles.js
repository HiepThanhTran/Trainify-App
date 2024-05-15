import {Dimensions, StyleSheet} from "react-native";

//Size Image
const {width, height} = Dimensions.get('screen');

const OnboardingStyles = StyleSheet.create({
    OnboardingContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
        paddingTop: 200
    },
    OnboardingImage: {
        width: width - 80,
        height: 330,
        resizeMode: 'contain'
    },
    OnboardingTitle: {
        fontSize: 28,
        marginTop: 60
    },
    OnboardingDescription: {
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        lineHeight: 30,
    },
    NextButton: {
        fontWeight: '600',
        fontSize: 16
    }
})

export default OnboardingStyles;