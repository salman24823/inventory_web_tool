import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { Plus } from "lucide-react";
import {Input} from "@heroui/react";


export default function Action() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalPlacement, setModalPlacement] = useState("bottom");

  return (
    <div className="flex justify-center items-center flex-col gap-4">
      <Button
        onPress={onOpen}
        className="bg-blue-500 text-white font-semibold text-sm"
      >
        Add New Order <Plus className="w-5" />
      </Button>

      <Modal
      className="h-[85vh]"
        isOpen={isOpen}
        placement={modalPlacement}
        onOpenChange={onOpenChange}
      >
        <ModalContent >
          {(onClose) => (
            <>
              <ModalHeader className="flex  flex-col gap-1">
                New Order
              </ModalHeader>
              <ModalBody>

              <Input className="border border-gray-300 rounded-xl" label="Name" type="text" />
              <Input className="border border-gray-300 rounded-xl" label="Phone" type="text" />
              <Input className="border border-gray-300 rounded-xl" label="Total Payment" type="text" />
              <Input className="border border-gray-300 rounded-xl" label="Pending Payment" type="text" />

            


              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
