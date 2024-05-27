import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
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
import ActivityStyle from './ActivityStyle';
import AllStyle from './AllStyle';

const screenWidth = Dimensions.get('window').width;

const BulletinDetail = ({ navigation, route }) => {
    const [bulletindetail, setBulletinDetail] = useState(null);
    const [activity, setActivity] = useState([]);
    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const bulletinID = route?.params?.bulletinID;

    const loadBulletinDetail = async () => {
        setLoading(true);
        try {
            let res = await APIs.get(endPoints['bulletin-detail'](bulletinID));
            setBulletinDetail(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadActivity = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endPoints['activities']}?bulletin_id=${bulletinID}&page=${page}&name=${name}`;
                console.log(url);
                let res = await APIs.get(url);
                if (res.data.next === null) {
                    setPage(0);
                }
                if (page === 1) {
                    setActivity(res.data.results);
                } else {
                    setActivity([...activity, ...res.data.results]);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadBulletinDetail();
    }, []);

    useEffect(() => {
        loadActivity();
    }, [page, name]);

    const loadMore = ({ nativeEvent }) => {
        console.log(isCloseToBottom(nativeEvent));
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
            setPage(page + 1);
        }
    };

    const onRefresh = useCallback(async () => {
        setPage(1);
        setActivity([]);
        setRefreshing(true);
        await loadActivity();
        setRefreshing(false);
    }, []);

    const search = (value) => {
        setPage(1);
        setName(value);
    };

    const goActivityDetail = (id, name) => {
        navigation.navigate('ActivityDetail', { id, name });
    };

    return (
        <>
            {loading ? (
                <View style={GlobalStyle.Container}>
                    <ActivityIndicator size="large" color={Theme.PrimaryColor} />
                </View>
            ) : (
                <View style={GlobalStyle.BackGround}>
                    <View style={AllStyle.ContainerScreenDetail}>
                        <ScrollView
                            onScroll={loadMore}
                            key={bulletindetail?.id || 'bulletin-detail-scroll'}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            {bulletindetail && (
                                <View style={AllStyle.Description}>
                                    <View style={AllStyle.CardImage}>
                                        {bulletindetail?.cover && (
                                            <Image
                                                style={AllStyle.ImageDetail}
                                                source={{ uri: bulletindetail.cover }}
                                            />
                                        )}
                                    </View>

                                    <RenderHTML
                                        contentWidth={screenWidth}
                                        source={{ html: bulletindetail.content }}
                                        baseStyle={AllStyle.ContentDetail}
                                    />

                                    <Text style={AllStyle.DateDetail}>
                                        Ngày tạo: <Text>{formatDate(bulletindetail.created_date)}</Text>
                                    </Text>
                                    <Text style={AllStyle.DateUpdate}>
                                        Ngày cập nhập: <Text>{formatDate(bulletindetail.updated_date)}</Text>
                                    </Text>
                                </View>
                            )}

                            <View style={AllStyle.ActivitContainer}>
                                <Text style={AllStyle.TitleDetail}>Danh sách hoạt động</Text>

                                <View style={GlobalStyle.BackGround}>
                                    <View>
                                        <View style={[AllStyle.Search, { marginTop: 2 }]}>
                                            <TextInput
                                                style={AllStyle.SearchInput}
                                                placeholder="Tìm kiếm hoạt động"
                                                onChangeText={search}
                                                value={name}
                                            />
                                        </View>

                                        {activity.map((activity) => (
                                            <TouchableOpacity
                                                key={activity.id}
                                                onPress={() => goActivityDetail(activity.id, activity.name)}
                                            >
                                                <View style={AllStyle.Card}>
                                                    <Text style={AllStyle.ActivityTitle}>{activity.name}</Text>
                                                    <View
                                                        style={[ActivityStyle.ActivityCardImage, { marginBottom: 10 }]}
                                                    >
                                                        <Image
                                                            source={{ uri: activity.image }}
                                                            style={AllStyle.ActivityImage}
                                                        />
                                                    </View>
                                                    <RenderHTML
                                                        contentWidth={screenWidth}
                                                        source={{ html: activity.description }}
                                                        baseStyle={AllStyle.Content}
                                                        defaultTextProps={{
                                                            numberOfLines: 3,
                                                            ellipsizeMode: 'tail',
                                                        }}
                                                    />

                                                    <Text style={AllStyle.DateDetail}>
                                                        Ngày bắt đầu: <Text>{formatDate(activity.start_date)}</Text>
                                                    </Text>
                                                    <Text style={AllStyle.DateDetail}>
                                                        Ngày kết thúc: <Text>{formatDate(activity.end_date)}</Text>
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}
        </>
    );
};

export default BulletinDetail;
