import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { Text, View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import SplashStyle from './Style';

const Splash = ({ navigation }) => {
    const animation = useRef(null);

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

    const handleDone = async () => {
        await AsyncStorage.setItem('splash-done', 'true');
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn' }],
        });
    };

    const renderButton = (label) => {
        return (
            <View style={{ padding: 12 }}>
                <Text style={SplashStyle.Button}>{label}</Text>
            </View>
        );
    };

    return (
        <AppIntroSlider
            style={GlobalStyle.BackGround}
            data={animations}
            showSkipButton
            onDone={handleDone}
            renderItem={({ item }) => {
                return (
                    <View key={item.id} style={SplashStyle.OnboardingContainer}>
                        {item.image && (
                            <LottieView
                                style={SplashStyle.OnboardingImage}
                                source={item.image}
                                ref={animation}
                                autoPlay
                                loop
                            />
                        )}
                        <Text style={SplashStyle.OnboardingTitle}>{item.title}</Text>
                        <Text style={SplashStyle.OnboardingDescription}>{item.description}</Text>
                    </View>
                );
            }}
            activeDotStyle={{ backgroundColor: Theme.PrimaryColor, width: 20 }}
            renderNextButton={() => renderButton('Tiếp tục')}
            renderSkipButton={() => renderButton('Bỏ qua')}
            renderDoneButton={() => renderButton('Hoàn tất')}
        />
    );
};

export default Splash;
