import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BottomSheet from './BottomSheet'
import { Camera, Frame, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera'
import { Face, FaceDetectionOptions, useFaceDetector } from 'react-native-vision-camera-face-detector'
import { Heading, HStack, VStack, ZStack } from 'native-base'
import Fade from 'react-native-fade'
import { useSharedValue, Worklets } from 'react-native-worklets-core'
import colors from '@/colors'
import { ImageEditor } from "expo-crop-image";
import { useDispatch } from 'react-redux'
import { registerActions } from '@/redux/slices/registerSlice'
import Animated from 'react-native-reanimated'

type Props = {
    open?: boolean
    video?: boolean
    onCloseFinish?: () => void
    setVideo?: (video: string) => void
    setImage?: (video: string) => void
    setImageOCRData?: (data: any) => void
    cameraType?: "front" | "back"
}

const { height, width } = Dimensions.get('window')
const CameraComponent: React.FC<Props> = ({ open, onCloseFinish, setVideo, setImage, cameraType = "back", video = false }: Props) => {
    const ref = useRef<Camera>(null);
    const dispatch = useDispatch()
    const faceBox = useSharedValue({ x: 0, y: 0, width: 0, height: 0 })

    const [progress, setProgress] = useState<number>(5);
    const [recording, setRecording] = useState<boolean>(false);
    const [fade, setFade] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const device = useCameraDevice(cameraType);
    const faceDetectionOptions = useRef<FaceDetectionOptions>({}).current
    const { detectFaces } = useFaceDetector(faceDetectionOptions)


    const handleDetectedFaces = Worklets.createRunOnJS((faces: Face[]) => {
        if (faces.length > 0) {
        }
    })

    const frameProcessor = useFrameProcessor((frame: Frame) => {
        'worklet'
        const faces = detectFaces(frame)
        
        if (faces.length > 0) {
            faceBox.value = faces[0].bounds
            console.log("face detected", faces[0].bounds);
        }

        handleDetectedFaces(faces)
        // faceBox.value = { x: 0, y: 0, width: 0, height: 0 }

    }, [])

    useEffect(() => {
        setPreviewUrl("")
    }, [open])


    const startRecording = async () => {
        if (ref.current) {
            ref.current.startRecording({
                onRecordingFinished: (video) => {
                    if (setVideo) {
                        setVideo(video.path)
                        dispatch(registerActions.setFaceVideoUrl(video.path))

                        if (onCloseFinish)
                            onCloseFinish()
                    }
                },
                onRecordingError: (error) => console.error(error)
            });
        }
        setRecording(true)
    }

    const stopRecording = async () => {
        if (ref.current) {
            await ref.current.stopRecording();
        }

        setRecording(false)
        setProgress(0)
    }


    useEffect(() => {
        let interval: NodeJS.Timeout;
        (async () => {
            let s = 5
            if (recording) {
                setFade(true)
                interval = setInterval(() => {
                    s = s - 1
                    setFade(false)
                    setProgress(s)
                    setFade(true)

                    if (s === 0) {
                        stopRecording()
                    }

                }, 1500);
            }
        })()

        return () => clearInterval(interval);

    }, [recording])

    const takePicture = async () => {
        if (ref.current) {
            const photo = await ref.current.takePhoto();
            setPreviewUrl(photo.path)
        }
    }

    return (
        <BottomSheet showDragIcon={false} height={height * 0.90} open={open} onCloseFinish={onCloseFinish}>
            {device &&
                <ZStack flex={1}>
                    <Camera
                        preview={true}
                        ref={ref}
                        photo={true}
                        video={true}
                        style={StyleSheet.absoluteFillObject}
                        device={device}
                        frameProcessor={frameProcessor}
                        pixelFormat="rgb"
                        isActive
                    />
                    <Animated.View style={[faceBox.value, {borderWidth: 1, backgroundColor: "red"}]}/>
                    <VStack w={"100%"} h={"100%"}>
                        {previewUrl ?
                            <HStack w={"100%"} h={"90%"} bg={"black"} justifyContent={"center"} alignItems={"center"} p={"20px"}>
                                <ImageEditor
                                    editorOptions={{
                                        coverMarker: {
                                            show: true
                                        },
                                        controlBar: {
                                            height: 100,
                                            cancelButton: {
                                                text: 'Cancelar',
                                                iconName: 'cancel',
                                                color: 'white',
                                            },
                                            cropButton: {
                                                text: 'Cortar',
                                                iconName: 'crop',
                                                color: 'white',
                                            },
                                            backButton: {
                                                text: 'Atras',
                                                iconName: 'arrow-back',
                                                color: 'white',
                                            },
                                            saveButton: {
                                                text: 'Guardar',
                                                iconName: 'check',
                                                color: 'white',
                                            }
                                        }
                                    }}
                                    isVisible={true}
                                    imageUri={previewUrl}
                                    fixedAspectRatio={1.5}
                                    onEditingCancel={() => {
                                        setPreviewUrl("")
                                    }}

                                    onEditingComplete={async (image) => {
                                        if (setImage)
                                            setImage(image.uri)
                                    }}
                                />
                            </HStack>
                            :
                            <VStack w={"100%"} h={"100%"} justifyContent={"space-between"} alignItems={"center"} pb={"50px"}>
                                <HStack position={"absolute"} top={"60%"}>
                                    <Fade visible={fade} direction="up">
                                        <Heading opacity={0.5} fontSize={`${width / 2.2}px`} mt={"20px"} color={"red"}>{progress}</Heading>
                                    </Fade>
                                </HStack>
                                <HStack space={20}>
                                    {!recording ?
                                        <TouchableOpacity onPress={() => video ? startRecording() : takePicture()}>
                                            <HStack borderColor={"white"} borderWidth={3} bg={"white"} borderRadius={100} style={styles.Shadow}>
                                                <HStack borderColor={"black"} borderWidth={3} borderRadius={100} w={"65px"} h={"65px"} />
                                            </HStack>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => { }}>
                                            <HStack borderColor={"white"} borderWidth={3} w={"65px"} h={"65px"} borderRadius={100} justifyContent={"center"} alignItems={"center"} style={styles.Shadow}>
                                                <HStack bg={"red"} borderRadius={"5px"} w={"25px"} h={"25px"} />
                                            </HStack>
                                        </TouchableOpacity>
                                    }
                                </HStack>
                            </VStack>}
                    </VStack>
                </ZStack>
            }
        </BottomSheet>
    )
}

// eas build --profile development --platform ios

export default CameraComponent

const styles = StyleSheet.create({
    Shadow: {
        shadowColor: "#fff",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 1,
        elevation: 1,
    },
    InputsSucess: {
        borderColor: colors.mainGreen,
        borderWidth: 1,
        borderRadius: 10,
    },
    InputsFail: {
        borderColor: colors.alert,
        borderWidth: 1,
        borderRadius: 10,
    }
});