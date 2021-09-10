import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, TextInput, TouchableWithoutFeedback, Button } from 'react-native';

import { connect } from 'react-redux';
import { addTask, cancelTask, editTask, completeTask } from '../redux/actions/taskActions';
import Geolocation from 'react-native-geolocation-service';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TaskCard from '../components/TaskCard';
import AppBar from '../components/AppBar'
import AddButton from '../components/AddButton'
import Button1 from '../components/Button'
import moment from 'moment';

const { width, height } = Dimensions.get("screen");
const allTasksProps = (state) => {
    return {
        allTasks: state.home.AllTaskReducers.allTasks,
    }
}
const propsDispatch = { addTask, cancelTask, editTask, completeTask }

const HomeScreen = ({ allTasks, addTask, cancelTask, editTask, completeTask }) => {

    const [taskName, setTaskName] = useState(null)
    const [taskNameEdit, setTaskNameEdit] = useState(null)
    const [modal, setModal] = useState(false)
    const [modalUpdate, setModalUpdate] = useState(false)
    const [modalConfirmCancel, setModalConfirmCancel] = useState(false)
    const currentEdit = useRef(null)
    const currentIndex = useRef(null)

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

    const submitStatusChange = (index) => {
        currentEdit.current = allTasks[index]
        completeTask([index, !currentEdit.current.taskInfo.isComplete])
        setModalUpdate(false)
    }

    const submitEdit = () => {
        if (taskNameEdit) {
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

    return (

        <View style={{ height }}>
            <AppBar />
            <AddButton onPress={() => { setModal(true) }} />

            {allTasks &&
                allTasks.map((task, index) => (
                    <TaskCard
                        key={index}
                        taskStatus={task.taskInfo.isComplete}
                        taskName={task.taskInfo.title}
                        checkProp={() => { submitStatusChange(index) }}
                        editProp={() => { handleEdit(index) }}
                    />
                ))
            }

            {/* Modal Create */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modal}
                onRequestClose={() => { setModal(false) }}>
                <TouchableOpacity
                    style={styles.centeredView}
                    onPress={() => { setModal(false) }}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Agregar Nueva Tarea</Text>
                            <TextInput
                                placeholder={'Nombre de la Tarea'}
                                placeholderTextColor={'black'}
                                style={styles.textInput}
                                onChangeText={setTaskName}
                                value={taskName} />
                            <Button
                                title="Agregar"
                                color="#3366FF"
                                onPress={addTaskFunction} />
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
                            <Text style={styles.modalTitle}>Editar Tarea</Text>
                            <Text style={styles.headerInfo}>Titulo de la Tarea</Text>
                            <TextInput
                                placeholder={'Nombre de la Tarea'}
                                placeholderTextColor={'black'}
                                style={styles.textInput}
                                onChangeText={setTaskNameEdit}
                                value={taskNameEdit}
                            />

                            <View style={styles.space}>
                                <Text style={styles.headerInfo}>Fecha de Creacion</Text>
                                <Text>{currentEdit.current && currentEdit.current.taskInfo.createDateTime}</Text>
                            </View>

                            <View style={styles.space}>
                                <Text style={styles.headerInfo}>Ultima Modificación</Text>
                                <Text>{currentEdit.current && currentEdit.current.taskInfo.lastUpdate}</Text>
                            </View>

                            <View style={styles.space}>
                                <Text style={styles.headerInfo}>Status</Text>
                                <Text>{currentEdit.current && currentEdit.current.taskInfo.isComplete ? "Completado" : "Activo"}</Text>
                            </View>

                            <View style={styles.space}>
                                <Text style={styles.headerInfo}>Ubicación</Text>
                                <Text>Latitud: {currentEdit.current && currentEdit.current.taskInfo.location.lat}</Text>
                                <Text>Longitud: {currentEdit.current && currentEdit.current.taskInfo.location.lng}</Text>
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

            {/* Confirm Cancel */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalConfirmCancel}
            >
                <TouchableOpacity style={styles.backPressCancel} onPress={() => { setModalConfirmCancel(false) }}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalConfirm}>
                            <Text style={styles.bold}>Estas Seguro de Cancelar esta tarea?</Text>
                            <Text style={styles.bold}>No Podras Recuperarla</Text>
                            <View style={styles.viewCancel}>
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
    textInput: { height: 50, borderColor: 'blue', borderWidth: 2, borderRadius: 10, color: 'black', marginBottom: 20 },
    modalTitle: {
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf: 'center',
        marginBottom: 20
    },
    headerInfo: { alignSelf: 'flex-start', fontWeight: 'bold' },
    space: { marginBottom: 10 },
    modalConfirm: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center"
    },
    backPressCancel: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    bold: { fontWeight: 'bold' },
    viewCancel: { marginTop: 20, justifyContent: 'space-between', flexDirection: 'row' }
});

export default connect(
    allTasksProps,
    propsDispatch
)(HomeScreen)

