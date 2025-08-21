import {Image, Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import ModalData from '../../shared/types/ModalData';
import FirmButton from '../../features/buttons/ui/FirmButton.tsx';

export default function ModalView({
  isModalVisible,
  setModalVisible,
  modalData,
}: {
  isModalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  modalData: ModalData;
}) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        if (!!modalData.closeButtonAction) {
          modalData.closeButtonAction();
        }
        setModalVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <FirmButton
            action={() => {
              if (!!modalData.closeButtonAction) {
                modalData.closeButtonAction();
              }
              setModalVisible(false);
            }}
            styleButton={{ position: 'absolute', right: 10, top: 10 }}
          >
            <Image
              source={require('../../shared/assets/images/close.png')}
              style={{ width: 30, height: 30 }}
            />
          </FirmButton>
          <Text style={styles.modalText}>{modalData.title}</Text>
          <ScrollView style={{maxHeight: 70, marginBottom: 10}}>
            <Text style={styles.modalText}>{modalData.message}</Text>
          </ScrollView>

          {!!modalData.positiveButtonText && (
            <FirmButton
              styleButton={[styles.button, styles.buttonClose]}
              action={() => {
                if (!!modalData.positiveButtonAction) {
                  modalData.positiveButtonAction();
                }
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>{modalData.positiveButtonText}</Text>
            </FirmButton>
          )}

          {!!modalData.negativeButtonText && (
            <FirmButton
              styleButton={[styles.button, styles.buttonClose]}
              action={() => {
                if (!!modalData.negativeButtonAction) {
                  modalData.negativeButtonAction();
                }
                setModalVisible(false);
              }}
            >
              <Text style={styles.textStyle}>{modalData.negativeButtonText}</Text>
            </FirmButton>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginVertical: 2
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  },
});
