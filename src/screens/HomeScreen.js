import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fontisto from 'react-native-vector-icons/Fontisto'
import TaskCard from '../components/TaskCard';
import AppBar from '../components/AppBar'
import AddButton from '../components/AddButton'
import Button from '../components/Button'

const { width, height } = Dimensions.get("screen");

const HomeScreen = ({ }) => {
    const [modal, setModal] = useState(false)

    useEffect(() => {

        PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]).then(async (resp) => {
            console.log(resp)
            if (
                resp['android.permission.ACCESS_FINE_LOCATION'] &&
                resp['android.permission.ACCESS_COARSE_LOCATION'] === "granted"
            ) {
                await AsyncStorage.setItem("@location_permissions", "true");
            } else if (
                resp['android.permission.ACCESS_FINE_LOCATION'] ||
                resp['android.permission.ACCESS_COARSE_LOCATION'] === "denied"
            ) {
                console.log("DENEGADO")
            } else {
                await AsyncStorage.setItem("@location_permissions", "true");
            }
        })

    }, []);

    return (

        <View style={{ height }}>
            <AppBar />
            <AddButton onPress={() => { setModal(true) }} />

            <TaskCard taskName={"HOLA"} taskStatus={0} />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: 20
                        }}>Nueva Tarea</Text>

                        <TextInput
                            placeholder={'Nombre de la Tarea'}
                            placeholderTextColor={'black'}
                            style={{ height: 60, width: '90%', borderColor: 'blue', borderWidth: 2, borderRadius: 10, color: 'black', marginBottom: 30 }}
                        />

                        <Button
                            label={"Agregar"}
                            backgroundColor={'red'}
                            borderRadius={10}
                            width={"90%"}
                            onPress={() => { setModal(false) }}
                            height={40}
                            fontSize={25}
                        />

                    </View>
                </View>
            </Modal>

        </View>
    )

}

export default HomeScreen;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 0
    },
    modalView: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopRightRadius: 17,
        borderTopLeftRadius: 17,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});