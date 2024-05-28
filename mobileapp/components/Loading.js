import { ActivityIndicator, View } from 'react-native';
import GlobalStyle from '../styles/Style';
import Theme from '../styles/Theme';

const Loading = ({ children, ...options }) => {
    return (
        <View style={{ ...GlobalStyle.Container , ...options.style}}>
            {children}
            <ActivityIndicator size="large" color={Theme.PrimaryColor} />
        </View>
    );
};

export default Loading;
