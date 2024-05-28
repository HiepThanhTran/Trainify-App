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
import { formatDate, isCloseToBottom } from '../../utils/Utilities';
import BulletinStyle from './BulletinStyle';

const screenWidth = Dimensions.get('window').width;

const Bulletin = ({ navigation }) => {
    const [bulletins, setBulletins] = useState([]);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadBulletins();
    }, [page, title]);

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
            } catch (error) {
                if (error.response) {
                    console.error(error.response.data);
                    console.error(error.response.status);
                    console.error(error.response.headers);
                } else if (error.request) {
                    console.error(error.request);
                } else {
                    console.error(`Error message: ${error.message}`);
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        }
    };

    const loadMore = ({ nativeEvent }) => {
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    const onRefresh = useCallback(async () => {
        setPage(1);
        setTitle('');
        setRefreshing(true);
        await loadBulletins();
    }, []);

    const search = (value) => {
        setPage(1);
        setTitle(value);
    };

    const goToBulletinDetail = (bulletinID, title) => {
        navigation.navigate('HomeStack', {
            screen: 'BulletinDetail',
            params: { bulletinID: bulletinID, title: title },
        });
    };

    return (
        <View style={GlobalStyle.BackGround} onTouchStart={() => Keyboard.dismiss()}>
            <View style={{ marginHorizontal: 12, marginTop: 40 }}>
                <View style={BulletinStyle.TopContainer}>
                    <Text style={BulletinStyle.Text}>Bản tin</Text>
                    <AntDesign name="message1" size={28} color={Theme.PrimaryColor} />
                </View>
                <View style={BulletinStyle.Search}>
                    <TextInput
                        style={BulletinStyle.SearchInput}
                        placeholder="Tìm kiếm bản tin"
                        onChangeText={search}
                        value={title}
                    />
                </View>

                <ScrollView
                    style={BulletinStyle.BulletinCardContainer}
                    onScroll={loadMore}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl colors={[Theme.PrimaryColor]} refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {bulletins.map((bulletin) => (
                        <TouchableOpacity
                            key={bulletin.id}
                            onPress={() => goToBulletinDetail(bulletin.id, bulletin.title)}
                        >
                            <View style={BulletinStyle.BulletinCard}>
                                <View style={BulletinStyle.BulletinCardImage}>
                                    <Image style={BulletinStyle.Image} source={{ uri: bulletin.cover }} />
                                </View>

                                <View style={BulletinStyle.BulletinsCardDetail}>
                                    <Text style={BulletinStyle.Title}>{bulletin.title}</Text>

                                    <RenderHTML
                                        contentWidth={screenWidth}
                                        source={{ html: bulletin.content }}
                                        baseStyle={BulletinStyle.Content}
                                        defaultTextProps={{
                                            numberOfLines: 2,
                                            ellipsizeMode: 'tail',
                                        }}
                                    />

                                    <Text style={BulletinStyle.Date}>
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
