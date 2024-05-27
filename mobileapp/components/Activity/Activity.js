import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import APIs, { endPoints } from "../../configs/APIs";
import ActivityStyle from "./ActivityStyle";
import GlobalStyle from "../../styles/Style";
import RenderHTML from "react-native-render-html";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;

const Activity = ({navigation, route }) => {
    const [activity, setActivity] = useState([]);
    const [loading, setLoading] = useState(false);
    const bulletinID = route.params?.bulletinID;
    const [page, setPage] = useState(1);
    const [name, setName] = useState("");

    const loadActivity = async () => {
        if (page > 0) {
            setLoading(true);
            try {
                let url = `${endPoints['activities']}?bulletin_id=${bulletinID}&page=${page}&name=${name}`;
                let res = await APIs.get(url);
                if (res.data.next === null) {
                    setPage(0);
                }
                if (page === 1) {
                    setActivity(res.data.results);
                } else {
                    setActivity(current => {
                        return [...current, ...res.data.results];
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        loadActivity();
    }, [bulletinID, page, name]);

    const handleScroll = useCallback(({ nativeEvent }) => {
        const paddingToBottom = 20;
        const currentOffset = nativeEvent.contentOffset.y;
        const height = nativeEvent.layoutMeasurement.height;
        const contentHeight = nativeEvent.contentSize.height;

        if (currentOffset + height + paddingToBottom >= contentHeight && !loading && page > 0) {
            setPage(page + 1);
        }
    }, [loading]);

    const search = (value) => {
        setPage(1);
        setName(value);
    };

    const goActivityDetail = (activityID, name) => {
        navigation.navigate('ActivityDetail', {'activityID': activityID, name:name });
    };

    return (
        <View style={GlobalStyle.BackGround}>
            <View style={ActivityStyle.ActivityContainer}>
                <View style={ActivityStyle.ActivitySearch}>
                    <TextInput
                        style={ActivityStyle.ActivitySearchInput}
                        placeholder="Tìm kiếm hoạt động"
                        onChangeText={search}
                        value={name}
                    />
                </View>

                <ScrollView onScroll={handleScroll}>
                    {activity.map((activity) => (
                        <TouchableOpacity key={activity.id} onPress={() => goActivityDetail(activity.id, activity.name)}>
                            <View style={ActivityStyle.ActivityCard}>
                                <Text style={ActivityStyle.ActivityTitle}>{activity.name}</Text>
                                <View style={AllStyle.CardImage}>
                                    <Image
                                        source={{ uri: activity.image }}
                                        style={ActivityStyle.ActivityImage}
                                    />
                                </View>
                                <RenderHTML
                                    contentWidth={screenWidth}
                                    source={{ html: activity.description }}
                                    baseStyle={[ActivityStyle.ActivityContent, {marginTop: 20}]}
                                    defaultTextProps={{
                                        numberOfLines: 3,
                                        ellipsizeMode: 'tail'
                                    }}
                                />
                            </View>
                        </TouchableOpacity>
                    ))}
                    {loading && <ActivityIndicator />}
                </ScrollView>
            </View>
        </View>
    );
};

export default Activity;