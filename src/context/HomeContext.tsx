import { createContext, MutableRefObject, ReactNode, useEffect, useRef, useState } from "react";

interface HomeContextData {
    filtro: string;
    canvasRef: MutableRefObject<HTMLCanvasElement>;
    onDrop: (files: File[]) => void;
    setFiltro: (filtro: string) => void;
    configFiltro: () => void;
    
}

interface HomeContextProviderProps {
    children: ReactNode;
}

export const HomeContext = createContext({} as HomeContextData);

interface Gray {
    calcular(red: number, green: number, blue: number):number;
}

class Media implements Gray{
    calcular(red: number, green: number, blue: number): number {
        return (red + green + blue)/3;
    }
}

class Vermelho implements Gray {
    calcular(red: number, green: number, blue: number): number {
        return red;
    }
}

class Verde implements Gray {
    calcular(red: number, green: number, blue: number): number {
        return green;
    }
}

class Azul implements Gray {
    calcular(red: number, green: number, blue: number): number {
        return blue;
    }
}


export const HomeContextProvier = ({children}:HomeContextProviderProps) => {
    const [images, setImages] =  useState<string[]>([]);
    const [filtro, setFiltro] =  useState<string>("normal");
    const [grayCalculator, setGrayCalculator] = useState<Gray>();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        if (images && images.length > 0) {
            const x = 500;
            const y = 500;
            const image = new Image();
            const canvas = canvasRef.current;
            canvas.width = x;
            canvas.height = y;
            const context =  canvas.getContext("2d");
            image.onload = () => {
                context.drawImage(image, 0, 0, x, y);
                if (filtro !== "normal" && grayCalculator) {
                    let imageData = context.getImageData(0, 0, x, y);
                    let data = imageData.data;
                
                    for (let i = 0; i < data.length; i+=4) {
                        const vermelho = data[i + 0];
                        const verde = data[i + 1];
                        const azul = data[i + 2];
                        const value = grayCalculator.calcular(vermelho, verde, azul);
                        data[i + 0] = value;
                        data[i + 1] = value;
                        data[i + 2] = value;
                    }
                    context.putImageData(imageData, 0, 0);
                } 
            }
            image.src = images[0];
        }
    }, [images, grayCalculator]);

    const configFiltro = () => {
        if (filtro === "media") {
            setGrayCalculator(new Media());
        }
        else if (filtro === "vermelho") {
            setGrayCalculator(new Vermelho());
        }
        else if (filtro === "verde") {
            setGrayCalculator(new Verde());
        }
        else if (filtro === "azul") {
             setGrayCalculator(new Azul());
        }
        setImages([...images]);
    }

    const onDrop = (files: File[]) => {
        if (files && files.length > 0) {
            files.map((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imagesUpdated = [String(e.target.result), ...images];
                    setImages(imagesUpdated);
                }
                reader.readAsDataURL(file);
                return file;
            });
        }
    }

    return (
        <HomeContext.Provider value={{
            filtro,
            canvasRef,
            onDrop,
            setFiltro,
            configFiltro
        }}>
            {children}
        </HomeContext.Provider>
    );
}