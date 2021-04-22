import styles from '../styles/Home.module.css'
import {useDropzone} from 'react-dropzone';
import { useContext } from 'react';
import { HomeContext } from '../context/HomeContext';

export default function Home() {
  const {
    filtro,
    onDrop,
    canvasRef,
    setFiltro,
    configFiltro
  } = useContext(HomeContext);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: ["image/*"]});

  return (
    <div className={styles.container}>
      <div className={styles.imageDrop} {...getRootProps()}>
          <input {...getInputProps()}/>
          <canvas className={styles.canvas} ref={canvasRef}>
          </canvas>
      </div>
      <div className={styles.form}>
        <select value={filtro} className={styles.filtro} onChange={e => setFiltro(e.target.value)}>
            <option value="normal">Normal</option>
            <option value="vermelho">Vermelho</option>
            <option value="verde">Verde</option>
            <option value="azul">Azul</option>
        </select>
        <button className={styles.botaoAplicar} onClick={configFiltro}>
          Aplicar
        </button>
      </div>
    </div>
  )
}
