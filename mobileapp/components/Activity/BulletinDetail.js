import { Text, View } from 'react-native';
import GlobalStyle from '../../styles/Style';

const BulletinDetail = ({ route }) => {
    const bulletinID = route.params?.bulletinID;
    return (
        <View style={GlobalStyle.Container}>
            <Text>Danh mục bài học số {bulletinID}</Text>
        </View>
    );
};

export default BulletinDetail;
