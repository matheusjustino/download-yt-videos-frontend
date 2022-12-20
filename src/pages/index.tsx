import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { toast, ToastOptions } from "react-toastify";
import { AxiosRequestConfig } from "axios";

// SERVICES
import { api } from "../services/api";

// HOOKS
import { useForm } from "../hooks/useForm.hook";

// COMPONENTS
import { Loader } from "../components/loader/loader";

interface FormInterface {
	videoUrl: string;
}

export default function Home() {
	const [form, handleForm] = useForm<FormInterface>({
		videoUrl: "",
	});
	const [isIframeLoaded, setIsIframeLoaded] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const notify = (message: string, options?: ToastOptions) => {
		toast(message, {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: false,
			closeOnClick: true,
			type: "success",
			toastId: "1",
			...options,
		});
	};

	const handleSubmit = () => {
		setIsLoading(true);

		const config: AxiosRequestConfig = {
			params: {
				url: form.videoUrl,
			},
		};

		api.get(`/youtube/download`, config)
			.then((response) => {
				const TYPE = response.headers["content-type"];
				const blob = new Blob([response.data], { type: TYPE });
				const link = document.createElement("a");
				link.href = window.URL.createObjectURL(blob);
				link.download = "video.mp4";
				link.click();
				link.remove();
			})
			.catch((error) => {
				console.error({ error });
				notify("Ops... algo deu errado com o download", {
					type: "error",
				});
			})
			.finally(() => {
				setIsLoading(false);
				notify("Download finalizado");
			});
	};

	return (
		<div className="relative h-[100vh] max-w-[800px] w-full m-auto flex items-center justify-center flex-col gap-8 p-8 bg-slate-300">
			<h1 className="text-4xl font-bold uppercase underline text-red-500 mb-[80px]">
				Baixe seus vídeos do Youtube
			</h1>

			<form className="w-full flex items-center sm:flex-row flex-col gap-2">
				<label
					className="flex-nowrap max-w-[250px] w-full text-xl font-medium"
					htmlFor="videoUrl"
				>
					Cole aqui a URL do vídeo
				</label>
				<input
					type="text"
					name="videoUrl"
					id="videoUrl"
					className="w-full h-[40px] border-2 border-gray-400 rounded-md"
					value={form.videoUrl}
					onChange={handleForm}
				/>
			</form>

			{isIframeLoaded && (
				<button
					type="button"
					onClick={handleSubmit}
					disabled={form.videoUrl.length === 0}
					className={`bg-green-600 text-white rounded-md p-2 font-semibold max-w-[250px] w-full hover:bg-green-800 ${
						form.videoUrl.length === 0
							? "cursor-not-allowed"
							: "cursor-pointer"
					}`}
				>
					{isLoading ? "Downloading..." : "Download vídeo"}
				</button>
			)}

			<iframe
				className="max-w-[800px] w-full max-h-[400px] h-full"
				src={`${form.videoUrl.replace("watch?v=", "embed/")}`}
				frameBorder="0"
				onLoad={(e) => {
					setIsIframeLoaded(true);
				}}
			></iframe>

			{isLoading && (
				<div className="absolute flex items-center justify-center z-10 bg-gray-500 w-[100vw] h-[100vh] opacity-70">
					<span>{isLoading}</span>
					<Loader />
				</div>
			)}
		</div>
	);
}
