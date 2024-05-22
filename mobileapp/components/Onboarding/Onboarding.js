import { CommonActions, useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import GlobalStyle from '../../styles/Style';
import OnboardingStyle from './Style';

// Animation
const animations = [
    {
        id: 1,
        title: 'Điểm rèn luyện',
        description: 'Cùng nhau tham gia các hoạt động để tích lũy điểm rèn luyện',
        image: require('../../assets/animations/Study.json'),
    },
    {
        id: 2,
        title: 'Thống kê',
        description: 'Điểm rèn luyện sinh viên sẽ được thống kê một cách rõ ràng ',
        image: require('../../assets/animations/Statistical.json'),
    },
    {
        id: 3,
        title: 'Tư vấn',
        description: 'Đội ngũ chuyên viên nhiệt tình, giải quyết mọi thắc mắc của sinh viên',
        image: require('../../assets/animations/Advise.json'),
    },
];

const Onboarding = () => {
    //Navigation Home Page
    const navigation = useNavigation();
    const handleDone = () => {
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Signin' }],
            }),
        );
    };

    //Button Label
    const buttonLabel = (label) => {
        return (
            <View style={{ padding: 12 }}>
                <Text style={[GlobalStyle.SemiBold, OnboardingStyle.NextButton]}>{label}</Text>
            </View>
        );
    };
    //Load animations
    const animation = useRef(null);
    useEffect(() => { }, []);
    return (
        <AppIntroSlider style={GlobalStyle.BackGround}
            data={animations}
            renderItem={({ item }) => {
                return (
                    <View style={OnboardingStyle.OnboardingContainer}>
                        {item.image && (
                            <LottieView
                                style={OnboardingStyle.OnboardingImage}
                                source={item.image}
                                ref={animation}
                                autoPlay
                                loop
                            />
                        )}
                        <Text style={[GlobalStyle.Bold, OnboardingStyle.OnboardingTitle]}>{item.title}</Text>
                        <Text style={[GlobalStyle.SemiBold, OnboardingStyle.OnboardingDescription]}>
                            {item.description}
                        </Text>
                    </View>
                );
            }}
            activeDotStyle={{
                backgroundColor: '#3e9ae4',
                width: 20,
            }}
            showSkipButton
            renderNextButton={() => buttonLabel('Tiếp tục')}
            renderSkipButton={() => buttonLabel('Bỏ qua')}
            renderDoneButton={() => buttonLabel('Hoàn tất')}
            onDone={handleDone}
        />
    );
};

export default Onboarding;
