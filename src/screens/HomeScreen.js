import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal, TextInput, PermissionsAndroid, FlatList, TouchableWithoutFeedback, Button } from 'react-native';

import { connect } from 'react-redux';
import { addTask, cancelTask, editTask, completeTask } from '../redux/actions/taskActions';
import Geolocation from 'react-native-geolocation-service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import AsyncStorage from '@react-native-async-storage/async-storage';
import Fontisto from 'react-native-vector-icons/Fontisto'
import TaskCard from '../components/TaskCard';
import AppBar from '../components/AppBar'
import AddButton from '../components/AddButton'
import Button1 from '../components/Button'
import { current } from 'immer';
import moment from 'moment';

const { width, height } = Dimensions.get("screen");
const allTasksProps = (state) => {
    return {
        allTasks: state.AllTaskReducers.allTasks,
    }
}
const propsDispatch = { addTask, editTask}

const HomeScreen = ({ allTasks, addTask, editTask}) => {

    const [taskName, setTaskName] = useState(null)
    const [taskNameEdit, setTaskNameEdit] = useState(null)
    const [modal, setModal] = useState(false)
    const [modalUpdate, setModalUpdate] = useState(false)
    const currentEdit = useRef(null)
    const currentIndex = useRef(null)

    useEffect(() => {
        PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ]).then(async (resp) => {
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

    const addTaskFunction = async () => {
        Geolocation.getCurrentPosition(
            (position) => {
                addTask({
                    title: taskName ? taskName : "",
                    isComplete: false,
                    createDateTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    lastUpdate: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    location: { lat: position.coords.latitude, lng: position.coords.longitude }
                })
                setTaskName(null)
                setModal(false)
            },
            (error) => {
                temp = false;
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    const handleEdit = (index) => {
        currentIndex.current = index
        currentEdit.current = allTasks[index]
        setTaskNameEdit(currentEdit.current.taskInfo.title)
        setModalUpdate(true)
    }

    const submitEdit = () => {
        if (taskNameEdit && taskNameEdit > 1) {
            editTask([currentIndex.current, {
                id: currentEdit.current.id, taskInfo: {
                    title: taskNameEdit ? taskNameEdit : currentEdit.current.taskInfo.title,
                    isComplete: currentEdit.current.taskInfo.isComplete,
                    createDateTime: currentEdit.current.taskInfo.createDateTime,
                    lastUpdate: moment().format('MMMM Do YYYY, h:mm:ss a'),
                    location: currentEdit.current.taskInfo.location
                }
            }])
            setModalUpdate(false)
        }
        else {
            console.log("Tiene que ser mayor a 20")
        }
    }

    const handleCancel = () => {
        cancelTask(currentEdit.current.id)
        setModalUpdate(false)
        setModalConfirmCancel(false)
    }

    const cardTask = ({ item }) => (
        <TaskCard />
    );

    return (

        <View style={{ height }}>
            <AppBar />
            <AddButton onPress={() => { setModal(true) }} />

            {allTasks &&
                allTasks.map((task, index) => (
                    <View key={index} style={{ backgroundColor: 'grey', height: height / 15, width: '90%', marginBottom: 20, borderRadius: 10, alignSelf: 'center' }}>
                        <View style={{ flexDirection: 'row', alignContent: 'space-between', marginTop: 20, marginLeft: 30 }}>
                            <TouchableOpacity style={{ alignContent: 'flex-start', width: '20%' }}
                                onPress={() => { submitStatusChange(index) }}>
                                <View style={{
                                    backgroundColor: task.taskInfo.isComplete ? 'blue' : 'transparent',
                                    borderWidth: 3,
                                    borderColor: 'blue',
                                    width: 20,
                                    height: 20
                                }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flexDirection: 'row', width: '80%' }} onPress={() => { handleEdit(index) }}>
                                <View style={{ width: "80%" }}>
                                    <Text numberOfLines={1} style={{ fontSize: 20 }}>{task.taskInfo.title ? task.taskInfo.title : `Tarea ${task.id}`}</Text>
                                </View>
                                <View style={{ alignContent: 'flex-end', width: '20%' }}>
                                    <MaterialIcons name='arrow-forward-ios' size={20} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            }
            {/* Modal Create */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal}
                onRequestClose={() => { setModal(false) }}>
                <TouchableOpacity style={styles.centeredView} onPress={() => { setModal(false) }}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalView}>
                            <Text style={{
                                fontWeight: 'bold',
                                fontSize: 20
                            }}>Nueva Tarea</Text>
                            <TextInput
                                placeholder={'Nombre de la Tarea'}
                                placeholderTextColor={'black'}
                                style={{ height: 60, width: '90%', borderColor: 'blue', borderWidth: 2, borderRadius: 10, color: 'black', marginBottom: 30 }}
                                onChangeText={setTaskName}
                                value={taskName}
                            />
                            <Button1
                                label={"Agregar"}
                                backgroundColor={'red'}
                                borderRadius={10}
                                width={"90%"}
                                onPress={addTaskFunction}
                                height={40}
                                fontSize={25}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

            {/* Modal Update */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalUpdate}
                onRequestClose={() => { setModalUpdate(false) }}>
                <TouchableOpacity style={styles.centeredView} onPress={() => { setModalUpdate(false) }}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalView}>
                            <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>Titulo de la Tarea</Text>
                            <TextInput
                                placeholder={'Nombre de la Tarea'}
                                placeholderTextColor={'black'}
                                style={{ height: 40, borderColor: "#3366FF", borderWidth: 2, borderRadius: 5, color: 'black', marginBottom: 30 }}
                                onChangeText={setTaskNameEdit}
                                value={taskNameEdit}
                            />

                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>Fecha de Creacion</Text>
                                <Text style={{ alignSelf: 'flex-start' }}>{currentEdit.current && currentEdit.current.taskInfo.createDateTime}</Text>
                            </View>

                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>Ultima Modificación</Text>
                                <Text style={{ alignSelf: 'flex-start' }}>{currentEdit.current && currentEdit.current.taskInfo.lastUpdate}</Text>
                            </View>

                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>Status</Text>
                                <Text style={{ alignSelf: 'flex-start' }}>{currentEdit.current && currentEdit.current.taskInfo.isComplete ? "Completado" : "Activo"}</Text>
                            </View>

                            <View style={{ marginBottom: 10 }}>
                                <Text style={{ alignSelf: 'flex-start', fontWeight: 'bold' }}>Ubicación</Text>
                                <Text style={{ alignSelf: 'flex-start' }}>Latitud: {currentEdit.current && currentEdit.current.taskInfo.location.lat}</Text>
                                <Text style={{ alignSelf: 'flex-start' }}>Longitud: {currentEdit.current && currentEdit.current.taskInfo.location.lng}</Text>
                            </View>

                            <Button
                                title="Guardar"
                                color="#3366FF"
                                onPress={submitEdit}
                            />

                            <View style={{ marginTop: 20 }}>
                                <Button
                                    title="Cancelar"
                                    color="#FF493F"
                                    onPress={() => { setModalConfirmCancel(true) }}
                                />
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalConfirmCancel}
            >
                <TouchableOpacity style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 22,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)'
                }} onPress={() => { setModalConfirmCancel(false) }}>
                    <TouchableWithoutFeedback>
                        <View style={{
                            margin: 20,
                            backgroundColor: "white",
                            borderRadius: 20,
                            padding: 35,
                            alignItems: "center"
                        }}>
                            <Text style={{ fontWeight: 'bold' }}>Estas Seguro de Cancelar esta tarea?</Text>
                            <Text style={{ fontWeight: 'bold' }}>No Podras Recuperarla</Text>
                            <View style={{ marginTop: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                                <View style={{ marginRight: 5 }}>
                                    <Button
                                        title="Cancelar"
                                        color="grey"
                                        onPress={() => { setModalConfirmCancel(false) }}
                                    />
                                </View>
                                <View style={{ marginRight: 5 }}>
                                    <Button
                                        title="Aceptar"
                                        color="#FF493F"
                                        onPress={handleCancel}
                                    />
                                </View>
                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        margin: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalView: {
        backgroundColor: 'white',
        padding: 22,
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

export default connect(
    allTasksProps,
    propsDispatch
)(HomeScreen)

