import Modal from "@/app/components/Modal"
import Image from "next/image"

export default function ImageModal({ src, isOpen, onClose }) {
  if (!src) {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="w-80 h-80">
        <Image
          src={src}
          alt="Image"
          className="object-cover"
          fill
        />
      </div>
    </Modal>
  )
}
