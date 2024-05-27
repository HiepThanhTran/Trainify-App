import { AntDesign } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Keyboard,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import APIs, { endPoints } from '../../configs/APIs';
import GlobalStyle from '../../styles/Style';
import Theme from '../../styles/Theme';
import { formatDate, isCloseToBottom } from '../Utils/Utils';
import AllStyle from './AllStyle';

const screenWidth = Dimensions.get('window').width;

const Bulletin = ({ navigation }) => {
    const [bulletins, setBulletins] = useState([]);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadBulletins = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endPoints['bulletins']}?page=${page}&title=${title}`;
                let res = await APIs.get(url);
                if (res.data.next === null) {
                    setPage(0);
                }
                if (page === 1) {
                    setBulletins(res.data.results);
                } else {
                    setBulletins([...bulletins, ...res.data.results]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadBulletins();
    }, [page, title]);

    const loadMore = ({ nativeEvent }) => {
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    const search = (value) => {
        setPage(1);
        setTitle(value);
    };

    const dismissKeyboard = () => Keyboard.dismiss();

    const onRefresh = useCallback(async () => {
        setPage(1);
        setBulletins([])
        setRefreshing(true);
        await loadBulletins();
        setRefreshing(false);
    }, []);

    const goToBulletinDetail = (bulletinID, title) => {
        navigation.navigate('BulletinDetail', { bulletinID: bulletinID, title: title });
    };

    return (
        <View style={GlobalStyle.BackGround} onTouchStart={dismissKeyboard}>
            <View style={AllStyle.ContainerScreen}>
                <View style={AllStyle.BulletinTopContainer}>
                    <Text style={AllStyle.BulletinTitle}>Bản tin</Text>
                    <TouchableOpacity>
                        <AntDesign name="message1" size={28} color={Theme.PrimaryColor} />
                    </TouchableOpacity>
                </View>
                <View style={AllStyle.Search}>
                    <TextInput
                        style={AllStyle.SearchInput}
                        placeholder="Tìm kiếm bản tin"
                        onChangeText={search}
                        value={title}
                    />
                </View>

                <ScrollView
                    style={AllStyle.Container}
                    onScroll={loadMore}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {bulletins.map((bulletin) => (
                        <TouchableOpacity
                            key={bulletin.id}
                            onPress={() => goToBulletinDetail(bulletin.id, bulletin.title)}
                        >
                            <View style={AllStyle.Card}>
                                <View style={AllStyle.CardImage}>
                                    <Image style={AllStyle.Image} source={{ uri: bulletin.cover }} />
                                </View>

                                <View style={AllStyle.CardDetail}>
                                    <Text style={AllStyle.Title}>{bulletin.title}</Text>
                                    <RenderHTML
                                        contentWidth={screenWidth}
                                        source={{ html: bulletin.content }}
                                        baseStyle= {AllStyle.Content}
                                        defaultTextProps={{
                                            numberOfLines: 2,
                                            ellipsizeMode: 'tail',
                                        }}
                                    />

                                    <Text style={AllStyle.Date}>
                                        Ngày tạo: <Text>{formatDate(bulletin.created_date)}</Text>
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    {loading && page > 1 && <ActivityIndicator size="large" color={Theme.PrimaryColor} />}
                </ScrollView>
            </View>
        </View>
    );
};

export default Bulletin;
