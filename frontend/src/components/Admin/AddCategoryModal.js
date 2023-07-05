import { CheckIcon } from "@chakra-ui/icons";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from "@chakra-ui/react";
import { useRef, useState } from "react";

const AddCategoryModal = ({ isOpen, onClose, onAdd }) => {
    const [isDisabled, setDisabled] = useState(true);
    const categoryNameRef = useRef('');

    const categoryNameHandler = () => {
       setDisabled(categoryNameRef.current.value ? false : true);
    }

    const addCategoryHandler = () => {
        if (categoryNameRef.current.value) {
            onAdd(categoryNameRef.current.value);
            onClose();
        } else {
            setDisabled(true);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create category</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl>
                        <FormLabel>New category name</FormLabel>
                        <Input ref={categoryNameRef} autoFocus onChange={categoryNameHandler} />
                    </FormControl> 
                </ModalBody>

                <ModalFooter>
                    <Button leftIcon={<CheckIcon />} colorScheme='green' mr={3}
                        isDisabled={isDisabled} onClick={addCategoryHandler}>
                        Add
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
      </Modal>
    );
}

export default AddCategoryModal;