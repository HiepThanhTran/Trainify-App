import { View, Text, StyleSheet, TextInput, Modal, Image, ScrollView, TouchableOpacity, RefreshControl} from "react-native";
import { useEffect, useState } from "react";
import Theme from "../../styles/Theme";
import GlobalStyle from "../../styles/Style";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { statusCode } from "../../configs/Constants";
import APIs, { endPoints } from "../../configs/APIs";
import Loading from '../../components/common/Loading';
import moment from "moment";
import {onRefresh} from '../../utils/Utilities';

const RegisterAssistants = () => {
    const [openModal, setOpenModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [assistants, setAssistants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const loadAssistants = async () => {
        try {
            let res = await APIs.get(endPoints['assistants']);
            if (res.status === statusCode.HTTP_200_OK) {
                setAssistants(res.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadAssistants();
    }, [refreshing]);

    return (
        <View style={GlobalStyle.BackGround}>
            <View style={GlobalStyle.Container}>
                <View style={RegisterAssistantStyles.FormRegister}>
                    <Text style={RegisterAssistantStyles.FormRegisterTitle}>Đăng ký tài khoản cho trợ lý sinh viên</Text>
                    <View style={RegisterAssistantStyles.RegisterAssistantImageContainer}>
                        <Image
                            style={RegisterAssistantStyles.RegisterAssistantImage}
                            source={require('../../assets/images/RegisterAssistant.png')}
                        />
                    </View>
                    <View style={RegisterAssistantStyles.Field}>
                        <TouchableOpacity style={RegisterAssistantStyles.InputContainer} onPress={() => setOpenModal(true)}>
                            <Text style={RegisterAssistantStyles.Text}>Mã số trợ lý sinh viên</Text>
                            <Entypo name="newsletter" size={24} color="black" style={RegisterAssistantStyles.Icon} />
                        </TouchableOpacity>
                    </View>

                    <View style={RegisterAssistantStyles.Field}>
                        <View style={RegisterAssistantStyles.InputContainer}>
                            <TextInput
                                style={RegisterAssistantStyles.TextInput}
                                placeholder="Email trợ lý sinh viên"
                            />
                            <MaterialIcons name="email" size={24} color="black" style={RegisterAssistantStyles.Icon} />
                        </View>
                    </View>

                    <View style={RegisterAssistantStyles.Field}>
                        <View style={RegisterAssistantStyles.InputContainer}>
                            <TextInput
                                style={RegisterAssistantStyles.TextInput}
                                placeholder="Mật khẩu"
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={24}
                                    color="black"
                                    style={RegisterAssistantStyles.Icon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={RegisterAssistantStyles.ButtonContainer}>
                        <TouchableOpacity style={RegisterAssistantStyles.Button}>
                            <Text style={RegisterAssistantStyles.ButtonText}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal
                    visible={openModal}
                    onRequestClose={() => setOpenModal(false)}
                    animationType="slide"
                >
                    <View>
                        <TouchableOpacity onPress={() => setOpenModal(false)} style={RegisterAssistantStyles.CloseButton}>
                            <Text style={RegisterAssistantStyles.CloseButtonText}>Đóng</Text>
                        </TouchableOpacity>
                        <ScrollView
                            style={RegisterAssistantStyles.CardsContainer}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={() => onRefresh({ setRefreshing})}
                                />
                            }
                        >
                            {assistants && assistants.map((assistant) => (
                                <TouchableOpacity key={assistant.id} style={RegisterAssistantStyles.Card}>
                                    <View style={RegisterAssistantStyles.CardItem}>
                                        <View style={RegisterAssistantStyles.CardDes}>
                                            <AntDesign name="idcard" size={24} color="black" />
                                            <Text style={RegisterAssistantStyles.CardDesTitle}>{assistant.full_name}</Text>
                                        </View>
                                        <View style={RegisterAssistantStyles.CardDes}>
                                            <FontAwesome name="birthday-cake" size={24} color="black" />
                                            <Text style={RegisterAssistantStyles.CardDesTitle}>{moment(assistant.date_of_birth).format('DD/MM/YYYY')}</Text>
                                        </View>
                                    </View>

                                    <View style={[RegisterAssistantStyles.CardItem, { marginTop: 20 }]}>
                                        <View style={RegisterAssistantStyles.CardDes}>
                                            <FontAwesome name="transgender" size={24} color="black" />
                                            <Text style={RegisterAssistantStyles.CardDesTitle}>{assistant.gender}</Text>
                                        </View>
                                        <View style={RegisterAssistantStyles.CardDes}>
                                            <AntDesign name="phone" size={24} color="black" />
                                            <Text style={RegisterAssistantStyles.CardDesTitle}>{assistant.phone_number}</Text>
                                        </View>
                                    </View>
                                    
                                    <View style={RegisterAssistantStyles.Address}>
                                        <Text style={RegisterAssistantStyles.AddressTitle}>Address: {assistant.address}</Text>
                                    </View>

                                    <View style={RegisterAssistantStyles.Code}>
                                        <Text style={RegisterAssistantStyles.CodeTitle}>Code: {assistant.code}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const RegisterAssistantStyles = StyleSheet.create({
    FormRegister: {
        width: '100%',
        marginBottom: 50
    },
    FormRegisterTitle: {
        fontFamily: Theme.Italic,
        fontSize: 18,
        textAlign: 'center'
    },
    RegisterAssistantImageContainer: {
        width: '100%',
        height: 300
    },
    RegisterAssistantImage: {
        width: '100%',
        height: '100%'
    },
    Field: {
        marginVertical: 10,
        marginLeft: 16,
        marginRight: 16
    },
    InputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Theme.PrimaryColor,
        borderRadius: 8,
        padding: 6
    },
    TextInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
    Text: {
        flex: 1,
        height: 40,
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 0,
        color: 'gray'
    },
    Icon: {
        marginLeft: 10,
    },
    ButtonContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    Button: {
        backgroundColor: Theme.PrimaryColor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    ButtonText: {
        color: 'white',
        fontSize: 18,
        fontFamily: Theme.Bold
    },
    CardsContainer: {
        marginTop: 20,
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 50
    },
    Card: {
        borderWidth: 1,
        borderColor: Theme.PrimaryColor,
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },
    CardItem: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    CardDes: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    CardDesTitle: {
        fontFamily: Theme.SemiBold,
        fontSize: 16,
        marginLeft: 10
    },
    Address:{
        marginTop: 20
    },
    AddressTitle:{
        fontFamily: Theme.Italic,
        fontSize: 16
    },
    Code:{
        marginTop: 20
    },
    CodeTitle:{
        fontFamily: Theme.Bold,
        fontSize: 16,
    },
    CloseButton:{
        marginTop: 20,
        marginLeft: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: Theme.PrimaryColor,
        borderRadius: 8,
        alignSelf: 'flex-start'
    },
    CloseButtonText:{
        color: 'white',
        fontFamily: Theme.Bold,
        fontSize: 16,
    }
});

export default RegisterAssistants;