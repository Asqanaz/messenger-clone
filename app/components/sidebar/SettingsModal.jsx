"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import Modal from "../Modal"
import { Input } from "../inputs/Input"
import Image from "next/image"
import { CldUploadButton } from "next-cloudinary"
import { Button } from "../Button"
import { toast } from "react-hot-toast"

export default function SettingsModal({ isOpen, onClose, currentUser }) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors }
	} = useForm({
		defaultValues: {
			name: currentUser?.name,
			image: currentUser?.image
		}
	})

	const image = watch("image")

	const handleUpload = result => {
		setValue("image", result?.info?.secure_url, {
			shouldValidate: true
		})
	}

	const onSubmit = data => {
		setIsLoading(true)

		axios.post("/api/settings", data)
        .then(() => {
            router.refresh()
            onClose;
        })
        .catch(() => toast.error('Something went wrong!'))
        .finally(() => setIsLoading(false))
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="space-y-12">
					<div className="border-b border-gray-900/10 pb-12">
						<h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
						<p className="mt-1 text-sm leading-6 text-gray-600">Edit your public information.</p>
						<div className="mt-10 flex flex-col gap-y-8">
							<Input
								register={register}
								disabled={isLoading}
								label="Name"
								id="name"
								errors={errors}
								required
							/>
							<div>
								<label
									htmlFor=""
									className="block text-sm font-medium leading-6 text-gray-900"
								>
									Photo
								</label>
								<div className="mt-2 flex items-center gap-x-3">
									<Image
										width="48"
										height="48"
										className="rounded-full"
										src={image || currentUser?.image || "/images/avatar"}
									/>
									<CldUploadButton
										options={{ maxFiles: 1 }}
										onUpload={handleUpload}
										uploadPreset="wg6r4qfz"
									>
										<Button
											disabled={isLoading}
											secondary
											type="button"
										>
											Change
										</Button>
									</CldUploadButton>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-6 flex items-center justify-end gap-x-6">
						<Button
							disabled={isLoading}
							secondary
							onClick={onClose}
						>
							Cancel
						</Button>
						<Button
							disabled={isLoading}
							type="submit"
						>
							Save
						</Button>
					</div>
				</div>
			</form>
		</Modal>
	)
}
