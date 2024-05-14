import { View, Text, Dimensions } from "react-native";
import MyStyles from "../../styles/MyStyles";
import OnboardingStyles from "./OnboardingStyles";
import React, { useEffect, useRef } from 'react';
import AppIntroSlider from "react-native-app-intro-slider";
import LottieView from "lottie-react-native";
import { useNavigation } from '@react-navigation/native';

// Animations
const animations = [
    {
        id: 1,
        title: 'Điểm rèn luyện',
        description: 'Cùng nhau tham gia các hoạt động để tích lũy điểm rèn luyện',
        image: require('../../assets/animations/Study.json')
    },
    {
        id: 2,
        title: 'Thống kê',
        description: 'Điểm rèn luyện sinh viên sẽ được thống kê một cách rõ ràng ',
        image: require('../../assets/animations/Statistical.json')
    },
    {
        id: 3,
        title: 'Tư vấn',
        description: 'Đội ngũ chuyên viên nhiệt tình, giải quyết mọi thắc mắc của sinh viên',
        image: require('../../assets/animations/Advise.json')
    }
]

const Onboarding = () => {
     //Navigation Home Page
     const navigation = useNavigation();
     const handleDone = () => {
         navigation.navigate('Home');
     };

    //Button Label
    const buttonLabel = (label) => {
        return (
            <View style={{ padding: 12 }}>
                <Text style={[MyStyles.SemiBold, OnboardingStyles.NextButton]}>
                    {label}
                </Text>
            </View>
        )
    }
    //Load animations
    const animation = useRef(null);
    useEffect(() => {
    }, [])
    return (
        <AppIntroSlider
            data={animations}
            renderItem={({ item }) => {
                return (
                    <View style={OnboardingStyles.OnboardingContainer}>
                        {item.image && (
                            <LottieView style={OnboardingStyles.OnboardingImage}
                                source={item.image}
                                ref={animation}
                                autoPlay
                                loop
                            />
                        )}
                        <Text style={[MyStyles.Bold, OnboardingStyles.OnboardingTitle]}>{item.title}</Text>
                        <Text style={[MyStyles.SemiBold, OnboardingStyles.OnboardingDescription]}>{item.description}</Text>
                    </View>
                )
            }}
            activeDotStyle={{
                backgroundColor: '#1973bb',
                width: 20
            }}
            showSkipButton
            renderNextButton={() => buttonLabel("Tiếp tục")}
            renderSkipButton={() => buttonLabel("Bỏ qua")}
            renderDoneButton={() => buttonLabel("Hoàn tất")}
            onDone={handleDone}
        />
    )
}

export default Onboarding;